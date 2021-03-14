# Void Bot
Void is a whatsapp bot created with [@open-wa/wa-automate](https://github.com/open-wa/wa-automate-nodejs) and written in typescript, and this is my first open source project, if there is a mistake feel free to open a issues.


**NOTE:** I can't guarantee you will not be blocked by using this code, although it has worked for me. WhatsApp does not allow bots or unofficial clients on their platform, so this shouldn't be considered totally safe.

### *You can use my [link](https://gumroad.com/a/546575475) to support me when purchasing the lisence key on [Gumroad](https://gumroad.com/l/open-wa)*

### **Prerequisites**
- [node.js](https://nodejs.org/en/download/) v14 LTS
- [typescript](https://www.typescriptlang.org/download) latest version
- latest version of [Google Chrome](https://www.google.com/intl/en_en/chrome/)
- [MongoDB](https://www.mongodb.com/)

### **Installation**
Clone this project

```bash
> git clone https://github.com/Waxaranai/void-wa.git
> cd void-wa
```

Installing the dependencies (**make sure you're in the project directory that you've just cloned**):

```bash
> npm i
# or with yarn
> yarn
```
### **Setup & Using the bot**
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
3. Open http://localhost:5050/qr on your host browser and scan the **QRcode** with your **WhatsApp app** (or you can set the `qrLogSkip: false` on `index.ts` to scan the **QRcode** on the terminal)
4. Start using the bot by sending `$help` to the host/bot account (to change the prefix change it at `config.ts`)


### **Troubleshooting**
Make sure all the necessary dependencies are installed.
https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md

Fix Stuck on linux, install google chrome stable:
```bash
> wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
> sudo apt install ./google-chrome-stable_current_amd64.deb
```

### H**ow to contribute**
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am "Add some feature"`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

### **Donation & Support**
* Support me via [Saweria](https://saweria.co/donate/waxaranai)
