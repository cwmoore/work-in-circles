<?php

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