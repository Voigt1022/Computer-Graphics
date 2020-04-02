# Goals
I created realistic interactive lighting and materials in WebGL in a ‘virtual world.’ Users can move and explore 3D animated solid objects placed on a patterned ‘floor’ plane that stretches to the horizon in the x, y directions. The 3D objects in this ‘virtual world’ are made from different materials, each with individually-specified emissive, ambient, diffuse, specular parameters. The world also contains several smoothly-movable user-adjustable light sources, each with different position, ambient, diffuse, and specular parameters. Your program then uses lights, materials, surface-normals and more with several vertex/fragment shader pairs to compute the Phong lighting model in different ways, including ‘Gouraud’ shading (yields faceted appearance) and ‘Phong’ shading (for smooth-looking, facet-free surfaces with nicely rounded specular highlights).

I designed three robot doing exercise in the gym (Ground Grid). Also, I add lighting in the gym and use different shading and lighting methods to apply the lighting. Based on the knowledge of project, the page can also be resized.


# User Guide
Users can use ‘w/a/s/d’ to move the camera, use ‘i/j/k/l’ to change the camera direction. And ‘q’ is a switch for head light, ‘e’ is a switch for world light. ‘u’ is a switch for shading mode, ‘o’ is a switch for lighting mode. Also, users can change the position of light world light.
