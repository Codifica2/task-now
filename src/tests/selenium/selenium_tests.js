/* eslint-disable no-undef */
const { By, Builder, Browser, Key, until } = require('selenium-webdriver')
const { suite } = require('selenium-webdriver/testing')
const assert = require('assert')
require('chromedriver')

suite(function (env) {
  describe('When not authenticated', function () {
    let driver

    before(async () => {
      driver = await new Builder().forBrowser('chrome').build()
    })

    after(async () => {
      await driver.quit()
    })

    it('redirects to the login page and renders a form', async function () {
      // Test that redirect works
      await driver.get('http://localhost:3000/')
      await driver.wait(until.elementLocated(By.id('login-container')))
      const redirectedURL = await driver.getCurrentUrl()

      assert.equal('http://localhost:3000/login', redirectedURL)

      // Tests fails if elements are never located
      await driver.wait(until.elementLocated(By.id('username-input')))
      await driver.wait(until.elementLocated(By.id('password-input')))
    })
  })

  describe('When in the login page', function () {
    let driver

    before(async () => {
      driver = await new Builder().forBrowser('chrome').build()

      fetch('http://localhost:3000/api/users/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: 'Juan',
          lastName: 'Perez',
          password: 'password',
          email: 'juan.perez@mail.com'
        })
      })
    })

    after(async () => {
      await driver.quit()
      fetch('http://localhost:3000/api/users/', {
        method: 'DELETE'
      })
    })

    it('shows an error message if loging in with invalid credentials', async function () {
      await driver.get('http://localhost:3000/')
      await driver.wait(until.elementLocated(By.id('login-container')))

      // Input username
      const usernameField = await driver.findElement(By.id('username-input'))
      await usernameField.click()

      await driver.actions()
        .sendKeys(usernameField, 'new_user@mail.com')
        .perform()

      // Input password
      const passwordField = await driver.findElement(By.id('password-input'))
      await passwordField.click()

      await driver.actions()
        .sendKeys(passwordField, 'password')
        .perform()

      // Send form
      const loginButton = await driver.findElement(By.id('login-button'))
      loginButton.click()

      // Check if error is shown
      errorMessage = await driver.wait(until.elementLocated(By.className('text-danger')))
      assert.ok(errorMessage, 'error message should be displayed')
    })

    it('allows login in with valid credentials', async function () {
      await driver.get('http://localhost:3000/login')

      // Input username
      const usernameField = await driver.findElement(By.id('username-input'))
      await usernameField.click()

      await driver.actions()
        .sendKeys(usernameField, 'juan.perez@mail.com')
        .perform()

      // Input password
      const passwordField = await driver.findElement(By.id('password-input'))
      await passwordField.click()

      await driver.actions()
        .sendKeys(passwordField, 'password')
        .perform()

      // Send form
      const loginButton = await driver.findElement(By.id('login-button'))
      loginButton.click()

      // After a successful login, the app should redirect to dashboard
      await driver.wait(until.elementLocated(By.id('dashboard-container')))
      const redirectedURL = await driver.getCurrentUrl()
      assert.equal('http://localhost:3000/', redirectedURL)
    })

    it('has a link to go to the register page', async function () {
      await driver.get('http://localhost:3000/login')

      // Find link
      const registerLink = await driver.findElement(By.id('register-link'))
      registerLink.click()

      // After clicking the link, the user should be redirected to register
      await driver.wait(until.elementLocated(By.id('register-container')))
      const redirectedURL = await driver.getCurrentUrl()
      assert.equal('http://localhost:3000/register', redirectedURL)
    })
  })

  describe('When in the register page', function () {
    let driver

    before(async () => {
      driver = await new Builder().forBrowser('chrome').build()
    })

    after(async () => {
      fetch('http://localhost:3000/api/users/', {
        method: 'DELETE'
      })
      await driver.quit()
    })

    it('lets you register a new user', async function () {
      await driver.get('http://localhost:3000/register')

      const firstNameField = await driver.findElement(By.id('first-name-input'))
      const lastNameField = await driver.findElement(By.id('last-name-input'))
      const emailField = await driver.findElement(By.id('email-input'))
      const passwordField = await driver.findElement(By.id('password-input'))
      const confirmPasswordField = await driver.findElement(By.id('confirm-password-input'))
      const registerButton = await driver.findElement(By.id('register-button'))

      assert.ok([firstNameField, lastNameField, emailField, passwordField, confirmPasswordField, registerButton])

      // Input first name
      await firstNameField.click()

      await driver.actions()
        .sendKeys(firstNameField, 'Juan')
        .perform()

      // Input last name
      await lastNameField.click()

      await driver.actions()
        .sendKeys(lastNameField, 'Pérez')
        .perform()

      // Input email
      await emailField.click()

      await driver.actions()
        .sendKeys(emailField, 'juan.perez@mail.com')
        .perform()

      // Input password
      await passwordField.click()

      await driver.actions()
        .sendKeys(passwordField, 'password')
        .perform()

      // Input confirm password
      await confirmPasswordField.click()

      await driver.actions()
        .sendKeys(confirmPasswordField, 'password')
        .perform()

      // Send form
      registerButton.click()

      // After a successful register, the app should redirect to login
      await driver.wait(until.elementLocated(By.id('login-container')))
      const redirectedURL = await driver.getCurrentUrl()
      assert.equal('http://localhost:3000/login', redirectedURL)
    })

    it('does not let you register the same email two times', async function () {
      await driver.get('http://localhost:3000/register')

      const firstNameField = await driver.findElement(By.id('first-name-input'))
      const lastNameField = await driver.findElement(By.id('last-name-input'))
      const emailField = await driver.findElement(By.id('email-input'))
      const passwordField = await driver.findElement(By.id('password-input'))
      const confirmPasswordField = await driver.findElement(By.id('confirm-password-input'))
      const registerButton = await driver.findElement(By.id('register-button'))

      // Input first name
      await firstNameField.click()

      await driver.actions()
        .sendKeys(firstNameField, 'Juan')
        .perform()

      // Input last name
      await lastNameField.click()

      await driver.actions()
        .sendKeys(lastNameField, 'Pérez')
        .perform()

      // Input email
      await emailField.click()

      await driver.actions()
        .sendKeys(emailField, 'juan.perez@mail.com')
        .perform()

      // Input password
      await passwordField.click()

      await driver.actions()
        .sendKeys(passwordField, 'password')
        .perform()

      // Input confirm password
      await confirmPasswordField.click()

      await driver.actions()
        .sendKeys(confirmPasswordField, 'password')
        .perform()

      // Send form
      registerButton.click()

      // The form should show an error
      errorMessage = await driver.wait(until.elementLocated(By.className('text-danger')))
      assert.ok(errorMessage, 'error message should be displayed')
    })

    it('lets you login with the registered user', async function () {
      await driver.get('http://localhost:3000/login')

      // Input username
      const usernameField = await driver.findElement(By.id('username-input'))
      await usernameField.click()

      await driver.actions()
        .sendKeys(usernameField, 'juan.perez@mail.com')
        .perform()

      // Input password
      const passwordField = await driver.findElement(By.id('password-input'))
      await passwordField.click()

      await driver.actions()
        .sendKeys(passwordField, 'password')
        .perform()

      // Send form
      const loginButton = await driver.findElement(By.id('login-button'))
      loginButton.click()

      // After a successful login, the app should redirect to dashboard
      await driver.wait(until.elementLocated(By.id('dashboard-container')))
      const redirectedURL = await driver.getCurrentUrl()
      assert.equal('http://localhost:3000/', redirectedURL)
    })

    it('has a link to go back to the login page', async function () {
      await driver.get('http://localhost:3000/register')

      // Find link
      const loginLink = await driver.findElement(By.id('login-link'))
      loginLink.click()

      // After clicking the link, the user should be redirected to login
      await driver.wait(until.elementLocated(By.id('login-container')))
      const redirectedURL = await driver.getCurrentUrl()
      assert.equal('http://localhost:3000/login', redirectedURL)
    })

    it("doesn't let the user register if any field wasn't filled", async function () {
      await driver.get('http://localhost:3000/register')

      // If the fields aren't filled, the button should be disabled
      const registerButton = await driver.findElement(By.id('register-button'))
      let isDisabled = await registerButton.getAttribute('disabled')
      assert.ok(isDisabled, '')

      // If one field is blank, the button should still be disabled
      const firstNameField = await driver.findElement(By.id('first-name-input'))
      const lastNameField = await driver.findElement(By.id('last-name-input'))
      const emailField = await driver.findElement(By.id('email-input'))
      const passwordField = await driver.findElement(By.id('password-input'))
      const confirmPasswordField = await driver.findElement(By.id('confirm-password-input'))
      const fields = [firstNameField, lastNameField, emailField, passwordField, confirmPasswordField]

      // Case when first name field is blank
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        const fieldId = await field.getAttribute('id')

        if (fieldId !== 'first-name-input') {
          await driver.actions()
            .sendKeys(field, 'a')
            .perform()
        };
      };

      isDisabled = await registerButton.getAttribute('disabled')
      assert.ok(isDisabled, 'button should be disabled if first name is blank')

      // Case when last name field is blank
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        await driver.actions()
          .sendKeys(field, Key.BACK_SPACE)
          .perform()

        const fieldId = await field.getAttribute('id')

        if (fieldId !== 'last-name-input') {
          await driver.actions()
            .sendKeys(field, 'a')
            .perform()
        };
      };

      isDisabled = await registerButton.getAttribute('disabled')
      assert.ok(isDisabled, 'button should be disabled if last name is blank')

      // Case when email field is blank
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        await driver.actions()
          .sendKeys(field, Key.BACK_SPACE)
          .perform()

        const fieldId = await field.getAttribute('id')

        if (fieldId !== 'email-input') {
          await driver.actions()
            .sendKeys(field, 'a')
            .perform()
        };
      };

      isDisabled = await registerButton.getAttribute('disabled')
      assert.ok(isDisabled, 'button should be disabled if email is blank')

      // Case when password field is blank
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        await driver.actions()
          .sendKeys(field, Key.BACK_SPACE)
          .perform()

        const fieldId = await field.getAttribute('id')

        if (fieldId !== 'password-input') {
          await driver.actions()
            .sendKeys(field, 'a')
            .perform()
        };
      };

      isDisabled = await registerButton.getAttribute('disabled')
      assert.ok(isDisabled, 'button should be disabled if password is blank')

      // Case when confirm password field is blank
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        await driver.actions()
          .sendKeys(field, Key.BACK_SPACE)
          .perform()

        const fieldId = await field.getAttribute('id')

        if (fieldId !== 'confirm-password-input') {
          await driver.actions()
            .sendKeys(field, 'a')
            .perform()
        };
      };

      isDisabled = await registerButton.getAttribute('disabled')
      assert.ok(isDisabled, 'button should be disabled if confirm password is blank')

      // Check that if every field is filled, the button becomes enabled
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        await driver.actions()
          .sendKeys(field, Key.BACK_SPACE)
          .perform()

        await driver.actions()
          .sendKeys(field, 'a')
          .perform()
      };

      isDisabled = await registerButton.getAttribute('disabled')
      assert.ok(!isDisabled, 'button should be enabled if all fields are filled')
    })
  })
}, { browsers: [Browser.CHROME] })
