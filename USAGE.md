# USAGE

## 0. UI intro

* HEADER:
  * dashboard: list status / counts
  * name: current list name / title

* MAIN
  * tags: support intersection and union for set logic
  * pokemons: different style for different status 

* ASIDE
  * float buttons for quickly action
  * enhance actions:
    * __Record__: list all saved records, easily switch
    * __Share__ share with friend though short url or QRcode
    * __Export__: save as csv
    * custom __Style__: freely choose your favorite color
    * __Custom__: change language, show diff images, or custom different data source

* FOOTER
  additional info and link

## 1. Select your shiny pokemon

Just click the shiny pokemon you have.
There are five status for a pokemon:
and click will switch to next status cyclely

1. none: you did not meet them before
2. met: you met before, but not in bag now
3. own: them just in bag~
4. much: have much, and tradable!
5. pending trade: you arranged to receive one in a trade

## 2. Save your list

Click floating 💾 button to save current list.
That will keep list status when reload page.

## 3. Share list

You could see the link in popup control panel.
There are two links: full url & short url

You have to click `get short url` to generate everytime.
At the same time, you will get a QRcode for the shorter link

People could get you list status when open the link on their device.

## 4. Export as csv

That just someone needs that on an issue.
So, just that~

## 5. Custom style

I'm not good at colors, so, just choose the colors you like~

You could also change the grid size.
Someone like bigger image perhaps.

## 6. Custom config

#### 1. language
This site will try to get your language at first time.
But you might want to change language.
And I jsut do en/zh for ui now, might someone help other language translation?
locations translation file path: `src/lib/i18n.js`

#### 2. compare shiny and origin images

To enable this checkbox, you could see the origin image when mouse hover the pokemon

#### 3. show suffix name

Some poekmon have many types, like UNOWN family.
Add a suffix name will help to identify them.
If you do not need that, just disable that.

#### 4. custom data

I did not play pokemon go for years, and don't follow latest news now.
So I don't know when the new shiny pokemon will be released.
Latest some year, there are some nice people help to update the shiny data on GitHub.
I think that is good collaboration form~
Someone update data, someone maintain the code, good~

This data could be `.csv` or `.json`
You could see the data structure in `src/assets/data/pm.csv`

If you have a truble for host csv file.
You could convert csv to json, and host the json file alternative.
try to upload json to https://www.npoint.io
> There are many online tool to convert csv to json, just use one.

## 7. save as image

This work is too hard
There are too many image and style
Lots proplems on this feature
So, just use system print as PDF. :P