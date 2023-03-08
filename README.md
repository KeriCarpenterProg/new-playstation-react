## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## How to deploy this site to the cloud

Instructions on how to deploy a personal site on Google Cloud https://learn.nucamp.co/mod/book/view.php?id=6191&chapterid=6461

Go to console.cloud.google.com Login in with kericarpenter@gmail.com account (or your own Google account) Choose Activate Cloud Shell

Go to your project in VS Code. Go to the directory with your project on it. You have to have already set up your package.json so that it will build properly. Sharing that is outside the scope for this set of instructions, but package.json should have “Build” on it. Npm run build Will create a folder suitable for deploying -- like build/ or dist/ (in this case build/).

Open finder. Use finder to go to the build/ folder Compress dist folder into dist.zip Put that in the downloads folder (or any other clean directory)

Make sure you are in your home directory on cloud shell: /home/kericarpenter Type Pwd to see what directory you are in.

In Google Cloud shell, choose … Upload file. Upload build.zip to the shell.

Unzip the file unzip build.zip -d new-playstation-react

Cd new-playstation-react (or whatever the name of the project is)

> Firebase deploy

URL it is deployed to is: https://new-playstation-react.web.app

Julia
Hi, this is Eleanor!
