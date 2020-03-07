if [ ! -e "node_modules/discord.js" ]; then
	echo "Installing required files..."
	npm i discord.js
fi

while [ true ]
do
	echo "Starting bot..."
	node ./bot.js
	sleep 5
done
