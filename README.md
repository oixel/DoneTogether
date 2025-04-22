![DoneTogetherHeader](https://github.com/user-attachments/assets/45147ba8-5d9b-44be-bb1e-81db7896b90a)

## 👋 About DoneTogether
**DoneTogether** is a goal platform that harnesses collaboration and friendly competition to drive success with **social accountability**.
Create personal or shared goals, invite collaborators, and build momentum by maintaining daily streaks — all designed to help you stay motivated and *actually* finish what you start.

## 🚀 Installation Instructions
First, open a terminal and change the directory into the desired output folder. Then, run the following to clone into the DoneTogether repository:
```bash
git clone https://github.com/oixel/DoneTogether.git
cd DoneTogether
```
Change your directory to DoneTogether and run:
```bash
npm run install-all
```
When all the packages are finished installing, change the directory the client folder, add a .env file, and add 
```bash
VITE_CLERK_PUBLISHABLE_KEY={insert key}
```
Likewise, change the directory to the server folder add another .env file containing:
```bash
VITE_CLERK_PUBLISHABLE_KEY={insert key}
CLERK_PUBLISHABLE_KEY={insert key}
CLERK_SECRET_KEY={insert key}
MONGODB_URI={insert URI}
```
Change the directory one more time into the root DoneTogether folder and run:
```bash
npm run dev
```
Finally, open a browser and access DoneTogether with the local URL of localhost:5173. 🎉
## 💻 Technologies Used
### Frontend
- React.js & React-Router
- TypeScript & JavaScript
- Figma Prototyping
- Framer Animations
- Clerk API (User Management UI components)

### Backend
- Node.js
- Express.js
- MongoDB
- Axios
- Clerk API (Authentication & Secure User Database)

## 📑 Contributers
Oixel Romero: https://www.linkedin.com/in/oixel/ \
Carson Fulmer: https://www.linkedin.com/in/carsonfulmer/ \
Kriti Shah: https://www.linkedin.com/in/kriti-shah989/ \
Krithika Kondapalli: www.linkedin.com/in/krithika-kondapalli
