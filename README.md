# OHM Trade Tracker

This is a set of small tools to track a trade position on OHM.

## The trade:

- Using ETH on Liquity to get LUSD (leverage :)).
- Buying OHM on spot.
- Staking OHM to get sOHM daily.

## The tools:

- Discord bot that send a daily summary to a your/any channel.

## Instructions:

- Clone the repo
- Run yarn install
- Create a .env file on /src directory with the following variables:
  -- DISCORD_CHANNEL_WEBHOOK_URL="your_webhook_url"
  -- ETH_ADDRESS="your_wallet_address"
- Use the execute.sh script to run the bot
- You can add a task as a cronjob or any other scheduling service to have this bot running how many times you want.
- Have fun and wgmi (3,3).
