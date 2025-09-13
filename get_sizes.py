from PIL import Image

suit = Image.open('static/suit.png')
ruined = Image.open('static/suit_ruined.png')

print('suit.png size:', suit.size)
print('suit_ruined.png size:', ruined.size)

# Resize ruined to match suit
resized_ruined = ruined.resize(suit.size)
resized_ruined.save('static/suit_ruined.png')

print('Resized suit_ruined.png to', suit.size)
