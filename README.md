# Void Bot
Void Bot is a Whatsapp Bot, this is my first open source project, if there is a mistake feel free to open a issues.

**NOTE:** I can't guarantee you will not be blocked by using this code, although it has worked for me. WhatsApp does not allow bots or unofficial clients on their platform, so this shouldn't be considered totally safe.

### Prerequisites
- Nodejs v14 LTS
- Typescript latest
- latest version of Google Chrome
- MongoDB

### Installation
Clone this project

```bash
> git clone https://github.com/Waxaranai/void.git
> cd void
```

Install the dependencies (`make sure you're in the project directory that you've just cloned`):

```bash
> npm i
# or with yarn
> yarn
```
### Using the bot
1. Create `.env` and fill out the `MONGODB_URI` (For example you can see `.env.example`)
2. Build the code 
```bash
> npm run build
# or with yarn
> yarn build
```
3. Run the code
```bash
> npm start
# or with yarn
> yarn start
```
3. Open http://localhost:5050/qr and scan the qrcode with your Whatsapp app (`or you can modify the create config to show the qrcode on terminal`)
4. Start using the bot by typing `$help` (to change the prefix change it at `config.ts`)


### Troubleshooting
Make sure all the necessary dependencies are installed.
https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md

Fix Stuck on linux, install google chrome stable:
```bash
> wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
> sudo apt install ./google-chrome-stable_current_amd64.deb
```

### How to contribute
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am "Add some feature"`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

### Donate
* [`Saweria`](https://saweria.co/donate/waxaranai)
