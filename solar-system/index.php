<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8">
        <title>Solar System Circoncentric</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <div id="contain">
            <canvas id="main_canvas"></canvas>
            <script src="script.js"></script>
        </div>
        <div class="prose">


        <b>
Tao Te Ching - Lao Tzu - chapter 32<br><br>
</b>

The Tao is forever undefined.<br>
Small though it is in the unformed state, it cannot be grasped.<br>
If kings and lords could harness it,<br>
The ten thousand things would naturally obey.<br>
Heaven and earth would come together<br>
And gentle rain fall.<br>
Men would need no more instruction<br>
&#160;&#160;&#160;&#160;&#160;and all things would take their course.<br><br>

Once the whole is divided, the parts need names.<br>
There are already enough names.<br>
One must know when to stop.<br>
Knowing when to stop averts trouble.<br>
Tao in the world is like a river flowing home to the sea.<br><br><br>

        </div>
        <code><pre><?php

// https://nssdc.gsfc.nasa.gov/planetary/factsheet/
// This is the average distance from the planet to the Sun in millions of kilometers or millions of miles, also known as the semi-major axis. All planets have orbits which are elliptical, not perfectly circular, so there is a point in the orbit at which the planet is closest to the Sun, the perihelion, and a point furthest from the Sun, the aphelion. The average distance from the Sun is midway between these two values. The average distance from the Earth to the Sun is defined as 1 Astronomical Unit (AU), so the ratio table gives this distance in AU.
$names = [
        "MERCURY", "VENUS", "EARTH", "MARS", "JUPITER", "SATURN", "URANUS", "NEPTUNE", "PLUTO"
    ];

// Distance from Sun (10^^6 km)
$distancesMKm = [
        57.9, 108.2, 149.6, 227.9, 778.6, 1433.5, 2872.5, 4495.1, 5906.4
    ];

// Distance from Sun (AU)
$distancesAU = [
        0.387, 0.723, 1, 1.52, 5.20, 9.58, 19.20, 30.05, 39.48
    ];


$merged = [];
foreach ($names as $ndx=>$name)
{
    $merged[$name] = [];
    $merged[$name]['ndx'] = $ndx;
    $merged[$name]['Mkm'] = $distancesMKm[$ndx];
    $merged[$name]['km'] = $distancesMKm[$ndx] * 1000000;

    //$merged[$name]['HgU'] = $distancesMKm[$ndx] / $distancesMKm[0];

    foreach ($names as $ndx2=>$name2)
    {
        $merged[$name]["$name2"] = $distancesMKm[$ndx] / $distancesMKm[$ndx2];
    }

    $merged[$name]['AU'] = $distancesAU[$ndx];

    // ratio to next inner or outer planet
    $merged[$name]['ratio_inner'] = $distancesMKm[$ndx] / $distancesMKm[$ndx - 1];
    $merged[$name]['ratio_outer'] = $distancesMKm[$ndx] / $distancesMKm[$ndx + 1];
    $merged[$name]['ratio_inner_outer'] = $merged[$name]['ratio_inner'] / $merged[$name]['ratio_outer'];
    $merged[$name]['ratio_outer_inner'] = $merged[$name]['ratio_outer'] / $merged[$name]['ratio_inner'];

    $merged[$name]['AUperMKm'] = $distancesAU[$ndx] / $distancesMKm[$ndx];
    $merged[$name]['MKmperAU'] = $distancesMKm[$ndx] / $distancesAU[$ndx];
}

print_r($merged);


echo "\n";
echo "\n";
foreach ($merged as $name=>$ratios)
{
    //echo "$name\t";
    echo "\t";
    foreach ($names as $ndx2=>$name2)
    {
        echo "\t\t" . $name2;
    }
    echo "\n";
    break;
}
foreach ($merged as $name=>$ratios)
{
    echo "$name\t";
    foreach ($names as $ndx2=>$name2)
    {
        echo "\t\t" . number_format($ratios[$name2], 3, '.', '');
    }
    echo "\n";
}


// n which divides most evenly into all average planetary orbits
$sumdiffs = [];
$maxN = 10 * $merged['MERCURY']['Mkm'];
//$maxN = 10 * $merged['PLUTO']['Mkm'];
for ($n = 1; $n < $maxN; $n++)
{
    $sumdiffs["a$n"] = 0;
    foreach ($merged as $ratios)
    {
        //if ($n > $ratios['Mkm']) continue;

        $mod = (10 * $ratios['Mkm']) % $n;
        //$div = $ratios['Mkm'] / $n;
        //$diff = ($n / pow($ratios['Mkm'], 2)) * abs($div - round($div));
        //$diff = $n * ($div - floor($div));
        // $sumdiffs["a$n"] += $diff;
        $sumdiffs["a$n"] += $mod;
    }
}

//uasort($sumdiffs, function ($a, $b) { return $a - $b; });
asort($sumdiffs);

print_r(array_slice($sumdiffs, 0 , 10));

$minMod = intval(substr(array_key_first($sumdiffs), 1));

echo "\n";
echo "\n";
foreach ($merged as $name=>$ratios)
{
    echo $name . "\t" . $ratios['Mkm'] / $minMod . "\n";
}

?>
</pre></code>

<footer class="prose">

<p>Excerpt from Tao Te Ching from Gia-fu Feng and Jane English translation</p>
<p>Planetary data from NASA</p>
<p>Generative artwork by <a href="https://www.curtiswmoore.com/">CMOORE</a> &copy; 2022</p>
<?php /*

<h3 class="prose"><b>Click anywhere on image to extract a PNG image file from the stream.</b></h3>
*/ ?>
</footer>
    </body>
</html>
