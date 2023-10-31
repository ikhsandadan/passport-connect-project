# Immutable Passport Integration

## Registering the application on Immutable Developer Hub
The first step to integrating **Immutable Passport** is to register your application on the [Immutable Hub](https://hub.immutable.com/). Upon logging in, you will be directed to this page:
![1](https://imageupload.io/ib/ipjS3XtA6Ej9TQX_1698742691.png)


Upon the successful login through your **Immutable Passport**, you will automatically be directed to the **Immutable Developer Hub**.  
  
Proceed to create a new project and name it **Default Project** or anything you want.

Choose “**Immutable zkEVM**” and click “**Create**”.

![2](https://imageupload.io/ib/l3rwP9XKyqA0po1_1698742862.png)

After that, in the "**Create Environment for Default Project**" menu, fill in the "**Name**" field with your desired name (this time, we will fill it in as "**Default Environment**"). Next, check the "**Testnet**" option in the environment section and click "**Create**".

![1](https://imageupload.io/ib/2emzAMcpkw2j0C1_1698743545.png)

Once you have completed this step, you will be redirected to the hub section. Then, navigate to the "**Passport**" menu on the left and select "**Add client**".

![4](https://imageupload.io/ib/NYrtpxlnSjavsFO_1698743670.png)

Complete the Passport client form to register your application. For "**Application Type**", select "**Web Application**". Fill in the "**Client name**" with your preferred name (this time, we'll use "**Connect Passport Project**").

In the "**Logout URLs**" field, enter the logout page of your application. Since it's still in the development stage, here we will use http://localhost:3000, which should match the port you're using.

Similar to "**Logout URLs**", in the "**Callback URLs**" field, enter http://localhost:3000/. This URL will be used by **Passport** to redirect to the destination page after a successful connection to Passport. Then, click "**Create**".

![5](https://imageupload.io/ib/EQ3R6jw04SPQRCG_1698743635.png)


Upon completion, you will see the following interface:
![6](https://imageupload.io/ib/cdprjgUqYkny8Af_1698743960.png)

Save the Client ID, which you will use in your application later.


## Creating A Project App
Clone this repository:

    git clone https://github.com/ikhsandadan/passport-connect-project.git


Once you have cloned the project repository, run the following command to change directory to the cloned repository and install the necessary libraries and dependencies.

    cd && npm install

In the code editor application you are using (in this case, I am using **VS Code**), open the "app.js" file in the project directory.
![7](https://imageupload.io/ib/O6HDv57JDHzfgZt_1698744182.png)


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

![8](https://imageupload.io/ib/gGmwd2kDbhdTa4g_1698744503.png)

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

![8](https://imageupload.io/ib/BU1MuGQw7UgxQFN_1698744776.png)


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

![9](https://imageupload.io/ib/zkKsm4NqF00dsR7_1698745247.png)

### Part 4 Log the user out
This part we going to log users out of **Passport** and your application. Copy the following code under “Part 4 Log the user out”.

    await passportInstance.logout();
    setIsLogin(false);
    setDefaultAccount("");
    setIsLoading(false);

![10](https://imageupload.io/ib/EMuIsKIKNcAS1hF_1698745372.png)

**Congratulations, now we have successfully connected Immutable Passport to our project.**

![11](https://imageupload.io/ib/K4xwPcbocPUxQV9_1698745451.png)

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
![12](https://imageupload.io/ib/S5bCMcVjR9H7Yf2_1698745924.png)
![13](https://imageupload.io/ib/L6OgnH4CYfBW2zq_1698745975.png)

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

![14](https://imageupload.io/ib/yuB72O5pVqqo338_1698746230.png)


Here is an example display of the project.
![15](https://imageupload.io/ib/57I095vOuqdfF9q_1698746289.png)
