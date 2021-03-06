const path = require('path');
const fs = require('mz/fs');
const config = require('config');
const TutorialViewStorage = require('../models/tutorialViewStorage');
const TutorialTree = require('../models/tutorialTree');
const localStorage = require('jsengine/local-storage').instance();
const log = require('jsengine/log')();

// pm2 trigger javascript tutorial_boot
async function boot() {
  if (process.env.TUTORIAL_EDIT) {
    // tutorial is imported and watched by another task
    return;
  }
  if (!await fs.exists(path.join(config.cacheRoot, 'tutorialTree.json'))) {
    throw new Error("FATAL: Tutorial not imported into cache. No tutorialTree.json");
  }

  await TutorialTree.instance().loadFromCache();

  await TutorialViewStorage.instance().loadFromCache();

  // clear rendered articles
  // for re-boot
  localStorage.clear(/^tutorial:/);

}

// add reboot action if pmx exists (for prod, not for local server)
process.on('message', function(packet) {
  log.info("process message", packet);
  if (packet.topic === 'tutorial:reboot') {
    log.info("tutorial reboot initiated");
    boot().then(function() { // if failed => uncaught promise && process dies?
      log.info("tutorial reboot complete")
    }).catch((err) => {
      log.error("tutorial reboot error", err);
      throw err;
    });
  }
});

/*

if (io) {
  io.action('tutorial_boot', function(reply) {
    boot().then(() => {
      reply({ answer : 'ok' });
    });
  });
}
*/
module.exports = boot;
