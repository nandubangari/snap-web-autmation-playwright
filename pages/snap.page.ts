import { Page, Locator } from '@playwright/test';
import { Messages } from '../constants/messages';

const storageStatePath = 'storageState.json';

export class LoginPage {
    private webchatBtn: Locator;
    private notNowBtn: Locator;
    private newChatBtn: Locator;
    private changedNewChatBtn: Locator;
    private chatBtn: Locator;
    private messageBox: Locator;


    constructor(private page: Page) {
        // define locators once
        this.webchatBtn = page.getByTestId('webchat');
        this.notNowBtn = page.getByRole('button', { name: 'Not now' });
        this.newChatBtn = page.locator("button[title='New Chat']:has(svg path[d*='M18.5'])");
        this.changedNewChatBtn = page.locator("button[title='New Chat']:has(svg path[d*='m9.103'])");
        this.chatBtn = page.getByRole('button', { name: 'Chat', exact: true });
        this.messageBox = page.getByRole('textbox');
    }

    async goto(): Promise<void> {
        await this.page.goto('https://accounts.snapchat.com/v2/login');
        await this.page.pause(); // remove in production
        await this.page.context().storageState({ path: storageStatePath });
        console.log('✅ Logged in and storage state saved');
    }

    async sendMessageToEveryone(): Promise<void> {

        await this.waitForCompleteload();
        await this.webchatBtn.click();
        await this.waitForCompleteload();
        await this.selectAllFriends();
    }

    private async selectAllFriends(): Promise<void> {
        await this.openNewChat();

        let friends = this.getFriendsLocator();
        await friends.last().waitFor({ state: 'visible', timeout: 300000 });

        const count = await friends.count();
        console.log(`✅ Total friends found: ${count}`);

        for (let i = 0; i < count; i++) {
            const friend = friends.nth(i);
            const friendName = (await friend.textContent())?.trim() ?? `Friend ${i + 1}`;

            if (/^[A-Z]$/.test(friendName)) {
                console.log(`⏭️ Skipping section header "${friendName}"`);
                continue;
            }

            try {
                console.log(`💬 Sending message to: ${friendName}`);
                await friend.click();
                await this.sendMessageToSelectedFriends();

                // reopen chat for next friend
                if (i < count - 1) {
                    await this.clcickNewChat();
                    friends = this.getFriendsLocator();
                    await friends.last().waitFor({ state: 'visible', timeout: 300000 });
                }
            } catch (error) {
                console.error(`❌ Failed to message ${friendName}:`, error);
                await this.recoverAndReopenChat();
                friends = this.getFriendsLocator();
                await friends.last().waitFor({ state: 'visible', timeout: 300000 });
            }

            await this.page.waitForTimeout(1000);
        }
    }

    private async sendMessageToSelectedFriends(): Promise<void> {
        await this.chatBtn.click();
        await this.messageBox.click();
        await this.messageBox.fill(Messages.Messages);
        await this.messageBox.press('Enter');
        console.log('✅ Message sent');
        await this.page.waitForTimeout(1000);
    }

    private async openNewChat(): Promise<void> {
        await this.waitForCompleteload();
        try {
            await this.notNowBtn.waitFor({ state: 'visible', timeout: 10000 });
            await this.notNowBtn.click();
        } catch {
            // ignore if not present
        }
        
        await this.newChatBtn.click();
        await this.waitForCompleteload();
    }

    private getFriendsLocator(): Locator {
        return this.page.locator("//li[.='A']/following-sibling::li | //li[.='A']");
    }

    private async recoverAndReopenChat(): Promise<void> {
        await this.page.reload();
        await this.waitForCompleteload();
        await this.newChatBtn.click();
    }

    private async waitForCompleteload(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('load');
    }

    private async clcickNewChat(): Promise<void> {
        for (let attempt = 1; attempt <= 3; attempt++) {
            console.log(`Attempt ${attempt}: clicking New Chat...`);
            await this.newChatBtn.click();

            try {
                await this.changedNewChatBtn.waitFor({ state: "visible", timeout: 3000 });
                console.log("✅ Button changed successfully");
                break;
            } catch {
                console.log("⚠️ Button did not change, retrying...");
                if (attempt === 3) throw new Error("❌ New Chat button did not change after 3 attempts");
            }
        }
    }
}
