const contractAddress = "0x7A49c3240dD116789535F02d3aC9B30A0bCEa2BD"; // Replace this with the actual contract address

const initApp = async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed and detect the current network
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const networkId = await window.ethereum.request({
        method: "net_version",
      });

      // Check if the connected network is Goerli (networkId 5)
      if (networkId === "5") {
        // Fetch the contract JSON artifacts asynchronously
        const response = await fetch("./build/contracts/PondNFT.json"); // Replace 'PondNFT' with your contract name
        const contractJSON = await response.json();

        // Create a contract instance using the ABI and contract address
        const pondNFTInstance = new web3.eth.Contract(
          contractJSON.abi,
          contractAddress
        );

        // Fetch the mintPrice from the contract using the mintPrice read method
        async function getMintPrice() {
          try {
            const mintPrice = await pondNFTInstance.methods.mintPrice().call();
            return mintPrice;
          } catch (error) {
            console.error("Error fetching mintPrice:", error);
            alert(
              "Error fetching mintPrice. Please check the console for details."
            );
          }
        }

        // Set up the form submission event handler
        const mintForm = document.getElementById("mintForm");
        mintForm.addEventListener("submit", async (event) => {
          event.preventDefault();

          const amountInput = document.getElementById("amount");
          const amountToMint = parseInt(amountInput.value, 10); // Parse the input to an integer

          try {
            // Fetch the mintPrice from the contract
            const mintPrice = await getMintPrice();

            // Calculate the total Ether required for minting
            const totalPayment = mintPrice * amountToMint;

            // Get the current user's Ethereum address (msg.sender)
            const accounts = await web3.eth.getAccounts();
            const senderAddress = accounts[0]; // Assuming the first account is the user's address

            // Ensure the sender's address is available
            if (!senderAddress) {
              alert(
                "Error: Unable to fetch sender's address. Please make sure you are connected to MetaMask."
              );
              return;
            }

            // Ask the user to confirm the transaction and send the payment
            const confirmTransaction = window.confirm(
              `Do you want to mint ${amountToMint} NFT(s) for ${totalPayment} Ether?`
            );
            if (confirmTransaction) {
              // Mint the NFT(s) to the sender's address (msg.sender) and send the payment
              await pondNFTInstance.methods
                .mint(amountToMint)
                .send({ from: senderAddress, value: totalPayment });
              alert(
                `${amountToMint} NFT(s) minted successfully to your address (${senderAddress})!`
              );
            } else {
              alert("Transaction canceled.");
            }
          } catch (error) {
            console.error("Error minting NFT:", error);
            alert("Error minting NFT. Please check the console for details.");
          }
        });

        // Hide the alert about switching to Goerli network (if it was shown before)
        const alertElement = document.getElementById("alertGoerli");
        alertElement.style.display = "none";
      } else {
        // Display an alert asking the user to switch to Goerli network
        const alertElement = document.getElementById("alertGoerli");
        alertElement.style.display = "block";
      }
    } catch (error) {
      // User denied account access or other error...
      console.error("Error connecting to MetaMask:", error);
      alert(
        "Error connecting to MetaMask. Please check the console for details."
      );
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
  }
  // Non-dapp browsers...
  else {
    alert("Please install MetaMask to use this DApp!");
    return;
  }
};

window.addEventListener("load", async () => {
  await initApp();
});
