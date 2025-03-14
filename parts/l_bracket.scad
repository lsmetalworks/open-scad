length1 = 50; // Placeholder
length2 = 75;
thickness = 2;
bend_angle = 90;

module l_bracket() {
    cube([length1, thickness, thickness]);
    rotate([0, 0, bend_angle])
        translate([length1, 0, 0])
        cube([thickness, length2, thickness]);
}

l_bracket();
