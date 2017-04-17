# byebyte - destroy your files in the name of art

![](http://i.imgur.com/2LR6uGK.jpg)

**byebyte 1.0.0 is out!** This has breaking changes to the API from 0.0.3; read this README to learn how to use it. If you need the old README, [it is here](https://github.com/wayspurrchen/byebyte/blob/d5fc78c8b8865a05bda040c806aa90d055cfd363/README.md).

## What?

**byebyte** is a command line tool written in Node.js that replaces random bytes in a file with random values.

**byebyte** can also be used as a node module. For info on how to use **byebyte** this way, please see [./node-module.md](./node-module.md).

## Why would I want to do that?

Because you like [glitch art](http://www.reddit.com/r/glitch_art) or you just need to destroy arbitrary data in a file for some reason while leaving most of it intact. Potential uses:

- Destroying various image files
- Glitching video files
- Randomizing text files
- Breaking your essay file so that your teacher can't open it and you get your deadline extended

## Installation

You'll need [Node.js 6](https://nodejs.org/) to run this file, so you need that installed first. You'll also need to learn [how to use a command line](http://lifehacker.com/5633909/who-needs-a-mouse-learn-to-use-the-command-line-for-almost-anything). Once you have Node, you can install byebyte pretty easily:

```
npm install -g byebyte
```

## Usage

You're set up! Byebyte has two modes, **destroy** and **shuffle**, as well as a series of **global paramaters** that are necessary with every command. The global parameters are as follows:

parameter | meaning | default
----- | ----- | -----
`-i, --input` | input file path | none, required
`-o, --output` | output file path | none, required
`--min` | the lower bound of the file to alter bytes in - use percentage 0 to 1 (ex: 0.15 = 15%, 1 = 100%). If specified, you cannot use --start or --stop | none, required
`--max` | the upper bound of the file to alter bytes in - use percentage from 0 to 1 (ex: 0.15 = 15%, 1 = 100%). If specified, you cannot use --start or --stop | none, required
`--start` | a specific point at the file, in bytes, at which to begin altering bytes. If specified, you cannot use --min or --max | none, required
`--stop` | a specific point at the file, in bytes, at which to stop altering bytes. If specified, you cannot use --min or --max | none, required

They're global because they are used by all commands in order to tell byebyte what file to alter as well as what portion of the file to alter.

- Use `-i` or `--input` to specify the file to change, and `-o` or `--output` to specify the target path for the resulting modified file.
- Use `--min` and `--max` to alter a percentage range of the file (for instance, `--min 0.2` and `--max 0.8` on a 200 byte file will cause changes within only bytes 40 to 160).
- Use `--start` and `--stop` to specify a specific byte range.
- You can only use `--min` and `--max` **or** `--start` and `--stop`.

## `destroy` mode

You can **destroy** files with the `destroy` command, which will replace random bytes in the file with trash data. For example, let's say I have this poem named `baby.txt`:

```
Little Baby

Little baby Oh so small 
One day you will be big and tall
I watch you while you laugh and play 
My love for you grows everyday 
I tell you this with my whole heart
I love you just the way you are
```

I can destroy it with the following command:

`byebyte destroy -i baby.txt -o baby_destroyed.txt --min 0 --max 1`

This short little poem is written to a new file,` baby_destroyed.txt`, which looks like:

```
Little Baby

Little baby Oh ±oDsmall 
2neHdayàyou wil be2digJañdtall
 watchyouìw°ile9you l³ugh and play 
My loe fr*you õrHws everydayB
‚ tell youÖt³is with myäÏholeheart
I Zove óou just the way you are
```

You can specify *how many times* you want to replace bytes in the file by using the `--times` or `-t` flag. For instance, we can replace 100 bytes in the first half of the poem with the following command:

`byebyte destroy -i baby.txt -o baby_destroyed2.txt --min 0 --max 0.5 -t 100`

We then get:

```
/it??a|?

??[?_ ֍???h:?,??>] ??e?:a: ?u ?ll?b? bi}?n?%tal?I atch???.hil?youTl??g?i>/?n?y 
My love for you grows everyday 
I tell you this with my whole heart
I love you just the way you are
```

Note that since the first half of the poem is only just under 90 bytes, replacing 100 bytes actually replaces some of the 90 bytes multiple times.

`destroy` also works great on images. Here's the `byebyte` "logo" after running it through `byebyte`:

```
byebyte -i byebyte.jpg -o byebytebroke.jpg -t 100
```

![](http://i.imgur.com/RKgupqW.jpg)

We can even do it again to the same image:

![](http://i.imgur.com/TAJKvnE.jpg)

Here's a panda:

![](http://i.imgur.com/AZX9cA2.png)

Here's the command:

```
byebyte -i byebyte.jpg -o byebytebroke.jpg -t 13000 -c false
```

Here's the result:

![](http://i.imgur.com/APB1w91.png)

BMPs have really simplistic data, so breaking them doesn't do a ton.

Video works well, too.

Here's a cool, comforting video: [find comfort in the light. // full moon timelapse](https://vimeo.com/135133471)

Here's the end example of my destroying parts of it and exporting a single part from the destroyed video as a GIF:

![](http://i.imgur.com/UmNgnkt.gif)

Here's the full result of the piece I made:

![](http://i.imgur.com/OY67z3C.gif)

## Continuous mode

The destroy command can use a "continuous mode" which means that every time a byte is replaced, there's a random chance that the next byte to be replaced will immediately follow the byte that was just replaced. This results in streams of corrupted data as opposed to a uniform distribution of data. Take the following example of a field of periods:

```
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
```

We can turn on the continuous behavior by setting `--continuous` or `-c` to true:

`byebyte destroy -i example.txt -o example_continuous.txt --min 0 --max 1 -t 200 --continuous true`

And we get:

```
.......òéAþÂ..........................HôŒÛ......4..........
.....................................“..........gYW-......
........’bSíŸU............¢....e...........S´nÏ8š........+.
....”’öØˆ…7.....A..........©}è].........{..........x÷W...
...........÷................................................
.........Ø".......Ì.....................Ö.......‹....À..÷..
...................+..../.mÌR¤¶............................
..........ìÝ¸±iFµ...............öÔœá.. ....................ä‚L......................ÁQ›Ð-×¸............................
..........................9°.........©....................
..............î......................¬|&6ú..................
.?.\¯é..........Å................±rŸ.....xß................
.............................*
².................n	ä..Ä.
...........................y.......åO......!................
..............................................ƒ..tçë.......t³...............................Â¨0.....IÖÕçó.............
....................................Ö{¸-................ .
.........,å¼....................................èQ×..èÉ....q!..._Üë............d...p..œ................................
.................................w........µ.................
............................................................
Ë ª¼Ø.......................................fjÍnJ...........
```

Note how many of the corruptions are clustered due to the continuous behavior. We can exaggerate the effect by affecting the random chance with the `--continous-chance` or `-C` parameters:

`byebyte destroy -i example.txt -o example_continuous.txt --min 0 --max 1 -t 200 -c true -C 0.98`

```
............................................................
............................................................
............................................................
............................................................
.................................q•:"úC®?ËôGì‘J»\äˆ%¨}Q·]:6¨gUžÆË‘oBìí¼sD¡€À?.....................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
.............................................,EéEÈ4XªH'ñ¬©²»¨ƒxáÙ%tAÅØœüL«–ºÇ†ýÛ“8 .......................-yQ(ãÐ+îvFeu.ÞARx6±þîjCçÂÐÔñ‹#ÖÉ"ŒJSªœ˜’ž‹šª˜V;8=à;pg+„BY®–¥G|ôãøJ!¿l¥LkäàävÓH............._älZ/l€ÇÅ´“{©.............
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
```

## `shuffle` mode

Shuffle mode will allow you to shuffle the contents of a file. Let's look at our baby poem example again.

```
Little Baby

Little baby Oh so small 
One day you will be big and tall
I watch you while you laugh and play 
My love for you grows everyday 
I tell you this with my whole heart
I love you just the way you are
```

To shuffle this file, we can use the `shuffle` command.

`byebyte shuffle -i baby.txt -o baby_shuffle.txt --min 0 --max 1 --chunk-min 20 --chunk-max 50`

The global parameters `-i`, `-o`, `--min`, and `--max` still remain the same, but there are two new required parameters, `--chunk-min` and `--chunk-max` which respectively define the minimum and maximum length that chunks should be.

We get the following result to `baby_shuffle.txt`:

```
ou will be big and tall
I watch yoou grows everyday 
I tell you this wiLittle Baby

Little babyth my whole heart
I love you ju Oh so small 
One day yu while you laugh and play 
My love for yst the way you are
```

Shuffling also has some interesting effects on images, particularly rawer formats like .TIFF:

![](http://i.imgur.com/VhAuzaJ.jpg)

![](http://i.imgur.com/tUaivU0.jpg)

Video files tend to get thoroughly destroyed, but with some potentially interesting effects, and audio files also get destroyed in weird ways. [Here's a link to a video example](http://i.imgur.com/S8zL4FG.gifv).

# This is awesome

Yeah? I'm glad you said so, because I happen to have a whole bunch of [glitch art resources](http://www.glitchet.com/resources) on my personal website/newsletter [Glitchet](http://www.glitchet.com/), not to mention a pretty kickass [Facebook page](http://www.facebook.com/glitchet) and [Tumblr](http://tumblr.glitchet.com). Feel free to send any feedback / questions to wayspurrchen@gmail.com.
