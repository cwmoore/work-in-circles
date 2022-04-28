<?php

function newtonsLawGravity($distance, $mass, $mass2=1988500)
{
    //$solar_mass = 1988500;
    $gravitational_constant = 6.67408 * pow(10, -11);

    return $gravitational_constant * $mass * $mass2 / pow(1000 * $distance, 2);
}


$lines = file('factsheet_metric.tsv');
$planets = array_slice(explode("\t", trim($lines[0])), 1);
foreach ($planets as $ndx=>$planet)
{
    $planets[$ndx] = trim($planet);
}
//print_r($planets);exit;


// planet-NAME=>[data columns...]
$planetDataMetric = [];

$rows = array_slice($lines, 1);
foreach ($rows as $row)
{
    $fields = explode("\t", trim($row));

    // fields[0] is the measurement (and units)

    // like "Distance from Sun (10^^6 km)" or "Ring System?"
    $ndxOfQMark = strpos($fields[0], '?');
    $ndxOfLParen = strpos($fields[0], '(');
    $ndxOfRParen = strpos($fields[0], ')');

    // extract the name of the measurement "Distance from Sun"
    $measurement = trim(substr($fields[0], 0, $ndxOfLParen > 0 ? $ndxOfLParen : ($ndxOfQMark > 0 ? $ndxOfQMark : strlen($fields[0]))));

    // extract the unit "10^^6 km"
    // actually "106 km" because superscript exponent in HTML not interpreted as exponent
    $unit = trim(substr($fields[0], 1 + $ndxOfLParen, $ndxOfRParen - $ndxOfLParen));

    // the rest of the columns are data
    $data = array_slice($fields, 1);
    foreach ($data as $ndx=>$datum)
    {
        //print_r($fields); exit;
        $planetDataMetric[$planets[$ndx]][$measurement] = preg_replace('/[^0-9.\-]/', '', $datum); //['value'=>$datum, 'unit'=>$unit];
        $planetDataMetric[$planets[$ndx]][$measurement] = strlen($planetDataMetric[$planets[$ndx]][$measurement]) ? $planetDataMetric[$planets[$ndx]][$measurement] : $datum;
    }
}

// unset not solar system planets
unset($planetDataMetric['MOON']);
unset($planetDataMetric['PLUTO']);


print_r($planetDataMetric);

echo "\n\pow('Distance from Sun', 2) / 'Orbital Period'\n";
foreach ($planetDataMetric as $planet=>$data)
{
    echo "$planet " . pow($data['Distance from Sun'], 2) / $data['Orbital Period'] . "\n";
}

echo "\n\nOrbital Velocity\n";
foreach ($planetDataMetric as $planet=>$data)
{
    echo "$planet " . $data['Orbital Velocity'] . "\n";
}

echo "\n\npow('Distance from Sun', 2) / Orbital Velocity\n";
foreach ($planetDataMetric as $planet=>$data)
{
    echo "$planet " . pow($data['Distance from Sun'], 2) / $data['Orbital Velocity'] . "\n";
}

echo "\n\nOrbital Velocity * Mass / pow('Distance from Sun', 2)\n";
foreach ($planetDataMetric as $planet=>$data)
{
    echo "$planet " . 3600 * $data['Orbital Velocity'] * $data['Mass'] / pow($data['Distance from Sun'], 2) . "\n";
}

echo "\n\nOrbital Velocity / Distance from Sun'\n";
foreach ($planetDataMetric as $planet=>$data)
{
    echo "$planet " . 3600 * $data['Orbital Velocity'] / pow($data['Distance from Sun'], 1) . "\n";
}

echo "\n\n Mass * Orbital Velocity / Distance from Sun'\n";
foreach ($planetDataMetric as $planet=>$data)
{
    echo "$planet " .  $data['Mass'] * $data['Orbital Velocity'] / pow($data['Distance from Sun'], 1) . "\n";
}

echo "\n\n Gravity formula\n";
foreach ($planetDataMetric as $planet=>$data)
{
    echo "$planet " .  newtonsLawGravity($data['Distance from Sun'], $data['Mass']) . "\n";
}

echo "\n\nOrbital velocity * Gravity formula\n";
foreach ($planetDataMetric as $planet=>$data)
{
    echo "$planet " . $data['Orbital Velocity'] * newtonsLawGravity($data['Distance from Sun'], $data['Mass']) . "\n";
}

echo "\n\nx Mercury Distance\n";
foreach ($planetDataMetric as $planet=>$data)
{
    echo "$planet\t" . round($data['Distance from Sun'] / 5.79) * 1 . "\n";
}

echo "\n\nlog 2 Distance\n";
foreach ($planetDataMetric as $planet=>$data)
{
    echo "$planet\t" . log($data['Distance from Sun'], 2) * 1 . "\n";
}

echo "\n\nlog 10 Distance \n";
foreach ($planetDataMetric as $planet=>$data)
{
    echo "$planet\t" . log($data['Distance from Sun'], 10) * 1 . "\n";
}

echo "\n\nround log 10 Distance\n";
foreach ($planetDataMetric as $planet=>$data)
{
    echo round(log($data['Distance from Sun'], 10) * 100) / 100 . "\n";
}

echo "\n\nlog e Distance\n";
foreach ($planetDataMetric as $planet=>$data)
{
    echo "$planet\t" . log($data['Distance from Sun'], exp(1)) * 1 . "\n";
}

echo "\n\nround log e Distance * 10\n";
foreach ($planetDataMetric as $planet=>$data)
{
    echo round(log($data['Distance from Sun'], exp(1)) * 10) . "\n";
}
/*
41
47
50
54
67
73
80
84
 */


echo "\n\nlog e round (Mercury Masses)\n";
foreach ($planetDataMetric as $planet=>$data)
{
    echo 1 + round(log($data['Mass'] / $planetDataMetric['MERCURY']['Mass'], exp(1))) . "\n";
}
/*
1
4
4
2
10
8
7
7
*/


echo "\n\nsqrt Distance\n";
foreach ($planetDataMetric as $planet=>$data)
{
    echo number_format(sqrt($data['Distance from Sun']), 2) . "\n";
}

echo "\n\nOrbital period\n";
foreach ($planetDataMetric as $planet=>$data)
{
    echo $data['Orbital Period'] . "\n";
}

?>