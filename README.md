# Immutable Passport Integration

## Registering the application on Immutable Developer Hub
The first step to integrating **Immutable Passport** is to register your application on the [Immutable Hub](https://hub.immutable.com/). Upon logging in, you will be directed to this page:

![hub1](https://github.com/ikhsandadan/passport-connect-project/assets/116878888/6c3b336d-3dfe-439e-ab7b-56927620a16e)

Upon the successful login through your **Immutable Passport**, you will automatically be directed to the **Immutable Developer Hub**.  
  
Proceed to create a new project and name it **Default Project** or anything you want.

Choose “**Immutable zkEVM**” and click “**Create**”.

![hub2](https://github.com/ikhsandadan/passport-connect-project/assets/116878888/5475d79b-d495-4453-b4b0-f8f2a5ec9a6a)

After that, in the "**Create Environment for Default Project**" menu, fill in the "**Name**" field with your desired name (this time, we will fill it in as "**Default Environment**"). Next, check the "**Testnet**" option in the environment section and click "**Create**".

![hub3](https://github.com/ikhsandadan/passport-connect-project/assets/116878888/01070e2d-dfaa-4913-a7c7-22e2a94f4049)

Once you have completed this step, you will be redirected to the hub section. Then, navigate to the "**Passport**" menu on the left and select "**Add client**".

![richtext_content](https://github.com/ikhsandadan/passport-connect-project/assets/116878888/26b32566-d122-4ea1-b8c5-c04515319a4c)

Complete the Passport client form to register your application. For "**Application Type**", select "**Web Application**". Fill in the "**Client name**" with your preferred name (this time, we'll use "**Connect Passport Project**").

In the "**Logout URLs**" field, enter the logout page of your application. Since it's still in the development stage, here we will use http://localhost:3000, which should match the port you're using.

Similar to "**Logout URLs**", in the "**Callback URLs**" field, enter http://localhost:3000/. This URL will be used by **Passport** to redirect to the destination page after a successful connection to Passport. Then, click "**Create**".

![hub4](https://github.com/ikhsandadan/passport-connect-project/assets/116878888/d80410e1-87c5-4e8c-8f21-df82afe47cb2)

Upon completion, you will see the following interface:

![hub5](https://github.com/ikhsandadan/passport-connect-project/assets/116878888/4221b7a8-ddca-47ca-9aa6-07409d5e384a)

Save the Client ID, which you will use in your application later.


## Creating A Project App
Clone this repository:

    git clone https://github.com/ikhsandadan/passport-connect-project.git


Once you have cloned the project repository, run the following command to change directory to the cloned repository and install the necessary libraries and dependencies.

    cd passport-connect-project && npm install

In the code editor application you are using (in this case, I am using **VS Code**), open the "app.js" file in the project directory.

![app1](https://github.com/ikhsandadan/passport-connect-project/assets/116878888/967bde61-9d20-48c7-9049-747a53b12913)

### Part 1 create Passport Instance
In this section, we will initialize the project with the **Passport Client**. Copy the following code under "**Part 1 create Passport Instance**".

    const passportInstance = new passport.Passport({
	baseConfig: new config.ImmutableConfiguration({
		environment: config.Environment.SANDBOX,}),
		clientId:  'INSERT_YOUR_CLIENTID', // Copy your Client ID in Immutable Hub here
		redirectUri: 'http://localhost:3000', // Must be same as Callback URLs in Immutable Hub
		logoutRedirectUri: 'http://localhost:3000', // Must be same as Logout URLs in Immutable Hub
		logoutMode: 'redirect',
		audience: 'platform_api',
		scope: 'openid offline_access email transact'
	});

Don't forget to replace the part "**INSERT_YOUR_CLIENTID**" with your **Client ID** from **Immutable Hub**. Fill in the "**redirectUri**" with the URL matching the one in the "**Callback URLs**" field on **Immutable Hub**, and populate the "**logoutRedirectUri**" with the URL matching the one in the "**Logout URLs**" field on **Immutable Hub**.

![app2](https://github.com/ikhsandadan/passport-connect-project/assets/116878888/2042aca2-74fd-4837-97b1-a99f2ea27ff9)

### Part 2 Authenticate user and login and set variables
This part we going to enabling users to log into our project using their **Passport** accounts. Users are required to log in before our project is able to interact with the User's wallet, or call any user specific functionality.

Copy the following code under "Part 2 Authenticate user and login and set variables".

    setIsLoading(true);
    const passportProviders = passportInstance.connectEvm();
    const accounts = await passportProviders.request({ method: "eth_requestAccounts" });
    const userProfile = await passportInstance.getUserInfo();
    const accessToken = await passportInstance.getAccessToken();
    const IdToken = await passportInstance.getIdToken();
    
    const balance =  parseInt(await passportProviders.request({
	    method: 'eth_getBalance',
	    params: [accounts.toString(), 'latest']
    }));
    
    const balanceToString = ethers.utils.formatEther(balance.toString());
    
    setBalance(balanceToString);
    setPassportProviders(passportProviders);
    setDefaultAccount(accounts);
    setProfile(userProfile);
    setAccessToken(accessToken);
    setIdToken(IdToken);
    setIsLogin(true);
    setIsLoading(false);

![app3](https://github.com/ikhsandadan/passport-connect-project/assets/116878888/9d7d04ea-2aa0-486c-b641-e56eeb3d3756)

In the section:

    const accounts = await passportProviders.request({ method: 'eth_requestAccounts' });

we are calling RPC methods to obtain the **Passport** user's wallet account.
In the section:

    const userProfile = await passportInstance.getUserInfo();

we will retrieve user information from the **Passport** user, such as email, sub, and nickname.

In the section:

    const accessToken = await passportInstance.getAccessToken();

we invoke the "**getAccessToken**" function to obtain the **Access Token** from the **Passport** User.

Similarly, in the part

    const IdToken = await passportInstance.getIdToken();

we call it to retrieve the **Id Token** from the **Passport** User.
In this part, we also use RPC methods such as "**eth_getBalance**" to obtain the **Passport** wallet balance for the user.

### Part 3 configure the login callback
At this part, we configure the route that handles requests to the **Redirect URI** will need to call the **loginCallback** method on page load.
Copy the following code under “Part 3 configure the login callback”.

    if (params.get("code")) {
	    try {
			passportInstance.loginCallback();
		} catch (e) {
			console.log(e);
		}
	}

![app4](https://github.com/ikhsandadan/passport-connect-project/assets/116878888/e27f0317-872f-49a6-812f-8419dfdd4b57)

### Part 4 Log the user out
This part we going to log users out of **Passport** and your application. Copy the following code under “Part 4 Log the user out”.

    await passportInstance.logout();
    setIsLogin(false);
    setDefaultAccount("");
    setIsLoading(false);

![app5](https://github.com/ikhsandadan/passport-connect-project/assets/116878888/1d71c0df-6552-4be2-93e0-811f2370922e)

**Congratulations, now we have successfully connected Immutable Passport to our project.**

![web1](https://github.com/ikhsandadan/passport-connect-project/assets/116878888/38cdeef8-4de2-4cbd-85ac-a1f59a83437f)

In the next step, we will attempt to make our first transaction by sending a certain amount of **IMX** from the **Passport** user's wallet to the destination wallet.

### Part 5 create Send Transaction function and get Transaction Hash
In this step, the user will send a certain amount of **IMX** (in this project, 0.0001) from the **Passport Wallet** user to the destination wallet. Copy the following code below "Part 5 create Send Transaction function and get Transaction Hash".

    const amountToHex = ethers.utils.parseEther("0.0001");
    
    try {
		const transactionHash = await passportProviders.request({
			method: 'eth_sendTransaction',
			params: [
				{
					to: 'INSERT_WALLET',
					value: amountToHex
				}, {gasLimit: 2_000_000}
			]
		});
		
		setTransactionHash(transactionHash);
		const balance =  parseInt(await passportProviders.request({
			method: 'eth_getBalance',
			params: [defaultAccount.toString(), 'latest']
		}));
		
		const balanceToString = ethers.utils.formatEther(balance.toString());
		
		await displayTransactionHash(transactionHash);
		
		setBalance(balanceToString);
		} catch (e) {
			console.log(e);
		}

By using the RPC method "**eth_sendTransaction**", we can directly execute a transaction with two parameters: the destination wallet and the "**value**" to be sent. Remember to replace "**INSERT_WALLET**" with your destination wallet address. This method generates a **Transaction Hash**, which we will save in the "**transactionHash**" variable. We then update the balance information of the user's wallet.

"Don't forget to ensure you have **TIMX** in your **Passport** wallet balance."

![app6](https://github.com/ikhsandadan/passport-connect-project/assets/116878888/be626955-b470-4305-b6f3-c82acaee0d84)

![confirmation](https://github.com/ikhsandadan/passport-connect-project/assets/116878888/eb3ca323-0c7a-4263-8011-2c041550adf9)

### Part 6 displaying Transaction Hash
In this final section, we call the RPC method "**eth_getTransactionByHash**" to display information about a transaction requested by its transaction hash. Copy the following code below "Part 6 displaying Transaction Hash".

    const displayTransactionHash = async (transactionHash) => {
	    try {
		    const transaction = await passportProviders.request({
			    method: 'eth_getTransactionByHash',
			    params: [
				    transactionHash
				]
			});
			
			setDisplayTransaction(transaction);
			console.log(transaction);
		} catch (e) {
			console.log(e);
		}
	};


The parameter used is the "**transactionHash**" obtained from the variable "**transactionHash**".

![app7](https://github.com/ikhsandadan/passport-connect-project/assets/116878888/8ddca1c1-fa2e-43e9-b094-bad90f246fbd)


Here is an example display of the project.

![app8](https://github.com/ikhsandadan/passport-connect-project/assets/116878888/e1dcb770-a60d-4ae1-9bb8-5805fa558180)
