# byebyte - destroy your files in the name of art

![](http://i.imgur.com/2LR6uGK.jpg)

## What?

**byebyte** is a command line tool written in Node.js that replaces random bytes in a file with random values.

## Why would I want to do that?

Because you like [glitch art](http://www.reddit.com/r/glitch_art) or you just need to destroy arbitrary data in a file for some reason while leaving most of it intact. Potential uses:

- Destroying various image files
- Glitching video files
- Randomizing text files
- Breaking your essay file so that your teacher can't open it and you get your deadline extended

## How?

You'll need [Node.js](https://nodejs.org/) to run this file, so you need that installed first. You'll also need to learn [how to use a command line](http://lifehacker.com/5633909/who-needs-a-mouse-learn-to-use-the-command-line-for-almost-anything) if you don't know already, and you will need [Git](https://git-scm.com/downloads). Next, you can clone the repository:

```
git clone https://github.com/wayspurrchen/byebyte.git
cd byebyte
npm install
```

This does these things:

1) clone this repository into the `byebyte` folder from wherever you ran the command.
2) navigate into the `byebyte` folder
3) install the dependencies `byebyte` needs to operate

You're set up! Now you can run byebyte like this:

`node index.js -f <inputfile> -o <outputfile> [more options]`

For example, if you wanted to destroy a text file, you would run:

`node index.js -f poem.txt -o newpoem.txt`

This short little poem:

```
Little Baby

Little baby Oh so small 
One day you will be big and tall
I watch you while you laugh and play 
My love for you grows everyday 
I tell you this with my whole heart
I love you just the way you are
```

becomes:

```
Little Baby

Little baby Oh ±oDsmall 
2neHdayàyou wil be2digJañdtall
 watchyouìw°ile9you l³ugh and play 
My loe fr*you õrHws everydayB
‚ tell youÖt³is with myäÏholeheart
I Zove óou just the way you are
```

### Parameters

| parameter | meaning | default |
| -- | -- | -- |
|`-f, --file`|input file path|none, required|
|`-o, --out`|output file path|none, required|
|`-t, --times`|number of bytes to replace|50|
|`--min`|(real number, 0.0 - 1.0) - the lower bound of the file to replace bytes in. you might use this to avoid corrupting the header of a file, rendering it unopenable|0.1|
|`--max`|(real number, 0.0 - 1.0) - the upper bound of the file to replace bytes in. you might use this to avoid corrupting the footer of a file, rendering it unopenable|0.9|
|`-c, --continuous`|if set to true, this will randomly decide to replace the next byte after the last one was replaced. you might do this to get "runs" of replaced bytes in a row instead of just scattered, randomly replaced pixels|true|
|`-C, --continuousChance`|(real number, 0.0 - 1.0) the chance, in decimal format, of the next byte being continuous. 0.6 = 60%, 0.2 = 20%, etc.|0.6|

## Examples?

You betcha!

### jpg

Here's the `byebyte` "logo" after running it through `byebyte`:

```
node index.js -f byebyte.jpg -o byebytebroke.jpg -t 100
```

![](http://i.imgur.com/RKgupqW.jpg)

We can even do it again:

![](http://i.imgur.com/TAJKvnE.jpg)

### bmp

Here's a panda:

![](http://i.imgur.com/AZX9cA2.png)

Here's the command:

```
node index.js -f byebyte.jpg -o byebytebroke.jpg -t 13000
```

Here's the result:

![](http://i.imgur.com/APB1w91.png)

BMPs have really simplistic data, so breaking them doesn't do a ton.

### video

Here's a cool, comforting video: [find comfort in the light. // full moon timelapse](https://vimeo.com/135133471)

Here's the end example of my destroying parts of it and exporting a single part from the destroyed video as a GIF:

![](http://i.imgur.com/UmNgnkt.gif)

Here's the full result of the piece I made:

![](http://i.imgur.com/OY67z3C.gif)

# This is awesome

Yeah? I'm glad you said so, because I happen to have a whole bunch of [glitch art resources](http://www.glitchet.com/resources) on my personal website/newsletter [Glitchet](http://www.glitchet.com/), not to mention a pretty kickass [Facebook page](http://www.glitchet.com/) and [Tumblr](http://tumblr.glitchet.com). Feel free to send any feedback / questions to wayspurrchen@gmail.com.