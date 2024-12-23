importScripts('tronweb.js');

let tronWeb = null;
let timer = null;

async function generateAccount() {
  if (tronWeb === null) {
    tronWeb = new TronWeb({
      fullNode: 'https://api.shasta.trongrid.io',
      solidityNode: 'https://api.shasta.trongrid.io',
    });
  }
  return tronWeb.createAccount();
}

function isMatch(address, config) {
  const { suffixList, suffixLen } = config;
  const addressSuffix = address.substring(address.length - suffixLen);
  if (suffixList.includes(addressSuffix)) {
    return {
      suffix: addressSuffix,
    };
  }
}

async function main(config) {
  let account = null;
  let count = 1;

  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  timer = setInterval(async () => {
    self.postMessage(['COUNT', 1]);

    account = await generateAccount();
    const address = account.address.base58;
    const matchedData = isMatch(address, config);

    if (matchedData && matchedData.suffix) {
      self.postMessage([
        'ITEM',
        {
          account,
          suffix: matchedData.suffix,
        },
      ]);
    }
  }, 0);
}

self.onmessage = function (e) {
  const [cmd, config] = e.data;
  if (cmd === 'START') {
    main(config);
  }

  if (cmd === 'STOP') {
    timer && clearInterval(timer);
    self.close();
  }
};
