import requests
import json
import os
import frontmatter


def getIngredientNutritionalData(foodID):
    data = requests.get(
        "https://api.nal.usda.gov/fdc/v1/food/{}?api_key=DMbAaQsgKG7ZndAHkTfFFSfiVU5mlDtpMkSNchME".format(foodID))

    return json.loads(data.text)


ingredientsDir = './src/lib/ingredients'
ingredients = os.listdir(ingredientsDir)

for filename in ingredients:
    ingredientPath = os.path.join(ingredientsDir, filename)
    ingredient = frontmatter.load(ingredientPath)
    metadata = ingredient.metadata
    
    nutrients = []
    if metadata['fdcID']:
        nutritionalData = getIngredientNutritionalData(metadata['fdcID'])

        for nutritionalElement in nutritionalData["foodNutrients"]:
            if 'amount' in nutritionalElement.keys() and 'nutrient' in nutritionalElement.keys():
                nutrients.append({
                    'amount': nutritionalElement['amount'],
                    'name': nutritionalElement['nutrient']['name'],
                    'unit': nutritionalElement['nutrient']['unitName'],
                })

        metadata['nutrients'] = nutrients

        frontmatter.dump(ingredient, ingredientPath)
