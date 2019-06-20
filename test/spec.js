const Spectron = require('spectron');
const Application = Spectron.Application;
const assert = require('assert');
const path = require('path');
const electron = require('electron');

describe('Open IAS Scoreboard Tests', function () {
    this.timeout(10000);

    before(function () {
        this.app = new Application({
            path: electron,
            args: [path.join(__dirname, '..'), 'testing'],
            env: {
                OPENIASSCOREBOARD_TESTING: "true"
            }
        });
        return this.app.start();
    });

    afterEach(function () {
        assert.equal(this.app.isRunning(), true);
    });

    after(function () {
        if (this.app && this.app.isRunning()) {
            return this.app.stop();
        }
    });

    describe('Opening Windows', function() {
        it('Open Control Board', async function () {
            assert.equal(await this.app.client.getWindowCount(), 1);
        });
        it('Open 1 Scoreboard', async function () {
            await this.app.client.$('#new-tab-button').click();
            assert.equal(await this.app.client.getWindowCount(), 2);
        });
    
        it('Open 2 Scoreboards', async function () {
            await this.app.client.$('#new-tab-button').click();
            assert.equal(await this.app.client.getWindowCount(), 3);
        });
    });

    describe('Switching Scoreboards', function () {
        it('Switch to 1st scoreboard by clicking', async function() {
            await this.app.client.$(`.tab-button[scoreboard-id="1"]`).click();
            assert.equal((await this.app.client.$(`.controls[scoreboard-id="1"].hidden`)).state, `failure`);
            assert.equal((await this.app.client.$(`.controls[scoreboard-id="2"].hidden`)).state, undefined);
        });
        it('Switch back to 2nd scoreboard by clicking', async function() {
            await this.app.client.$(`.tab-button[scoreboard-id="2"]`).click();
            assert.equal((await this.app.client.$(`.controls[scoreboard-id="1"].hidden`)).state, undefined);
            assert.equal((await this.app.client.$(`.controls[scoreboard-id="2"].hidden`)).state, `failure`);
        });
    });
    

});
