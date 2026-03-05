import { LoginPage } from './LoginPage.js';
import { ResetPasswordPage } from './ResetPasswordPage.js';
import { HomePage } from './HomePage.js';
import { expect } from '@playwright/test';

export class POmanager{

    constructor({ page, projectName }) {

        this.page = page;    
        this.projectName = projectName;        

        this.LoginPage = new LoginPage({ page, projectName });
    
        this.HomePage = new HomePage({ page, projectName });
        this.ResetPasswordPage = new ResetPasswordPage({ page, projectName });
        
    }


    getLoginPage(){ return this.LoginPage }
    getHomePage(){ return this.HomePage }
    getResetPasswordPage(){ return this.ResetPasswordPage }

    static async validateAPIresponse({ pageFixture, url_includes, methodType, statusCode, pageObjectsToClick = undefined, timeoutMillis = 15000, matchBody = undefined }) {

        let clickPromises = [];
        const debugMode = false;

        // For Debug Mode => Change the boolean to log all responses locally
        if (process.env.CI ? false : debugMode) {
            pageFixture.on('response', async response => {
                console.log(`Response: ${response.url()} ${response.status()} ${response.request().method()}`);
                console.log(`Headers: ${JSON.stringify(response.headers(), null, 2)}`);
                console.log(`Body: ${await response.text()}\n`);
            });
        }

        // Start listener before performing any click actions
        const responsePromise = pageFixture
            .waitForResponse(
                async response => {
                    const urlMatch = Array.isArray(url_includes)
                        ? url_includes.some(url => response.url().includes(url))
                        : response.url().includes(url_includes);
                    const methodMatch = response.request().method() === methodType;
                    const statusMatch = response.status() === statusCode;

                    // If matchBody is provided, check for k/v pairs in the request body
                    if (matchBody && methodType === 'POST') {
                        try {
                            const postData = response.request().postData();
                            const bodyObj = postData ? JSON.parse(postData) : {};
                            // Will check primitives for equality and arrays but not deep equality checks
                            for (const [k, v] of Object.entries(matchBody)) {
                                if (Array.isArray(v)) {
                                    if (!Array.isArray(bodyObj[k]) || bodyObj[k].toString() !== v.toString()) return false;
                                } else if (bodyObj[k] !== v) {
                                    return false;
                                }
                            }
                        } catch (e) {
                            return false;
                        }
                    }
                    return urlMatch && methodMatch && statusMatch;
                },
                { timeout: timeoutMillis }
            )
            .then(response => {
                const method = response.request().method();
                const url = response.url();
                return response.text().then(body => ({ url, method, status: response.status(), body }));
            });

        // GET requests on page load may not require a button click to invoke the API and this will skip pageObjectsToClick in those scenarios
        if (pageObjectsToClick) {
            if (Array.isArray(pageObjectsToClick)) {
                clickPromises = pageObjectsToClick.map(obj => obj.click());
            } else {
                clickPromises.push(pageObjectsToClick.click());
            }
        }

        // Perform any click actions
        const done = await Promise.all(clickPromises);
        expect(done.length).toEqual(clickPromises.length, 'All click actions could not be completed!')

        return await responsePromise;
    }



}