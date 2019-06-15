const Spectron = require('spectron');
const Application = Spectron.Application;
const assert = require('assert');
const path = require('path');
const electron = require('electron');

describe('Start Open IAS Scoreboard', function() {
    this.timeout(10000);

    beforeEach(function() {
        this.app = new Application({
            path: electron,
            args: [path.join(__dirname, '..'), 'testing'],
            env: {
                OPENIASSCOREBOARD_TESTING: "true"
            }
        });
        return this.app.start();
    });

    afterEach(function() {
        if (this.app && this.app.isRunning()) {
            return this.app.stop();
        }
    });

    it('Open Window', function() {
        return this.app.client.getWindowCount().then(
            function(count) {
                assert.equal(count, 1);
            }
        );
    });
});
