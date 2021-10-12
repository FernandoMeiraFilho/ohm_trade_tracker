// import axios from "axios";
import { providers, Contract, BigNumber } from "ethers";
import {
  DATE_STARTED,
  ETH_ADDRESS,
  ETH_NODE_URL,
  OHM_INITIAL_BALANCE,
  VALUE_INVESTED,
} from "./env";
import TroveManagerABI from "./ethereum/abi/troveManager.json";
import LiquityPriceFeedABI from "./ethereum/abi/liquityPriceFree.json";
import sOHMABI from "./ethereum/abi/sOHM.json";
import ohmABI from "./ethereum/abi/OHM.json";
import {
  bg16,
  bg7,
  liquityPriceFeedAddress,
  lusdAddress,
  ohmAddress,
  sOhmAddress,
  troveManagerAddress,
  zeroXapiUrl,
} from "./constants";
import axios from "axios";
import { DISCORD_CHANNEL_WEBHOOK_URL } from "./env";

const main = async () => {
  const provider = await new providers.JsonRpcProvider(ETH_NODE_URL);

  const troveManager = await new Contract(
    troveManagerAddress,
    TroveManagerABI,
    provider
  );
  const liquityPriceFeed = await new Contract(
    liquityPriceFeedAddress,
    LiquityPriceFeedABI,
    provider
  );
  const sOhmToken = await new Contract(sOhmAddress, sOHMABI, provider);
  const ohmToken = await new Contract(ohmAddress, ohmABI, provider);

  // Liquity data
  const ethPrice = await liquityPriceFeed.lastGoodPrice();
  const troveData = await troveManager.Troves(ETH_ADDRESS);
  const troveCR = await troveManager.getCurrentICR(ETH_ADDRESS, ethPrice);

  //   // OHM data
  const ohmInitialBalance = BigNumber.from(OHM_INITIAL_BALANCE);
  const ohmCurrentBalance = await sOhmToken.balanceOf(ETH_ADDRESS);
  const ohmDecimals = await ohmToken.decimals();
  const sOhmDecimals = await sOhmToken.decimals();

  //0x price Api
  const zero0query = `swap/v1/price?sellToken=${ohmAddress}&buyToken=${lusdAddress}&sellAmount=${BigNumber.from(
    "10"
  )
    .pow(ohmDecimals)
    .toString()}`;

  const zero0response: any = await axios.get(zeroXapiUrl + zero0query);
  const ohmPrice = parseFloat(zero0response.data.price);

  //getting dates
  const dateStarted = new Date(DATE_STARTED);
  const today = new Date();

  const diffInTime = today.getTime() - dateStarted.getTime();
  const daysInvested = diffInTime / (1000 * 3600 * 24);

  //making the final obj with all the data
  const finalData = {
    ethPrice: ethPrice.div(bg16).toNumber() / 100,
    ethCollateral: troveData.coll.div(bg16).toNumber() / 100,
    troveCR: troveCR.div(bg16).toNumber(),
    lusdDebt: troveData.debt.div(bg16).toNumber() / 100,
    ohmInitialBalance: ohmInitialBalance.div(bg7).toNumber() / 100,
    ohmCurrentBalance: ohmCurrentBalance.div(bg7).toNumber() / 100,
    netOhmGain: ohmCurrentBalance.sub(ohmInitialBalance).div(bg7) / 100,
    ohmLusdPrice: ohmPrice,
    currentOhmValue: ohmPrice * (ohmCurrentBalance.div(bg7).toNumber() / 100),
    currentNetProfit:
      ohmPrice * (ohmCurrentBalance.div(bg7).toNumber() / 100) -
      troveData.debt.div(bg16).toNumber() / 100,
    daysInvested: daysInvested,
    valueInvested: parseFloat(VALUE_INVESTED),
    ohmsToPayDebt: troveData.debt.div(bg16).toNumber() / 100 / ohmPrice,
    ohmsOwned:
      ohmCurrentBalance.div(bg7).toNumber() / 100 -
      troveData.debt.div(bg16).toNumber() / 100 / ohmPrice,
  };

  console.log(finalData);

  const discordMessage =
    `@everyone` +
    `\n\n__**LIQUITY TROVE INFO**__ \n` +
    `\n **LUSD Debt**: $${finalData.lusdDebt.toLocaleString("en-US")}, ` +
    `\n **Trove Collateral Rate**: ${finalData.troveCR}%` +
    `\n **ETH Price**: $${finalData.ethPrice.toLocaleString("en-US")}` +
    `\n\n__**OHM Investment INFO**__ \n` +
    `\n **OHM initial balance**: ${finalData.ohmInitialBalance}` +
    `\n **OHM current balance**: ${finalData.ohmCurrentBalance}` +
    `\n **OHM total gain from staking**: ${finalData.netOhmGain}` +
    `\n **OHM current Price**: $ ${finalData.ohmLusdPrice.toLocaleString(
      "en-US"
    )}` +
    `\n **OHMs necessary to pay debt**: ${finalData.ohmsToPayDebt}` +
    `\n **OHMs owned after debt **: ${finalData.ohmsOwned}` +
    `\n\n__**## Profit Summary ##**__ \n` +
    `\n **Number of days invested**: ${Math.round(finalData.daysInvested)}` +
    `\n **Number of days invested**: ${Math.round(finalData.daysInvested)}` +
    `\n **LUSD debt - OHM value (spot)**: $ ${finalData.currentNetProfit.toLocaleString(
      "en-US"
    )}` +
    `\n **Gross Gain %:** ${
      (finalData.currentNetProfit / finalData.lusdDebt) * 100
    } %` +
    `\n **Current APY**: ${(
      ((1 + finalData.currentNetProfit / finalData.lusdDebt) **
        (365 / finalData.daysInvested) -
        1) *
      100
    ).toLocaleString("en-US")} %`;

  const message = {
    content: discordMessage,
  };

  await axios.post(DISCORD_CHANNEL_WEBHOOK_URL, message);
};

main();
