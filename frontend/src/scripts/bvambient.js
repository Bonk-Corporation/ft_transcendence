/*-------------------------

BVAmbient - VanillaJS Particle Background
https://bmsvieira.github.io/BVAmbient/

Made by: Bruno Vieira

--------------------------- */

var isPaused = false;

export class BVAmbient {

    constructor({
        selector = 'defaultId',
        particle_number = "50",
        particle_maxwidth = "30",
        particle_minwidth = "5",
        particle_radius = "50",
        particle_opacity = true,
        particle_colision_change = true,
        particle_background = "#ededed",
        particle_image = {
            image: false,
            src: ""
        },
        responsive = [
            {
              breakpoint: "default"
            }
        ],
        fps = "60",
        max_transition_speed = 12000,
        min_transition_speed = 8000,
        refresh_onfocus = true
    }) 
    {
        // Define Variables
        this.selector = selector.substring(1);
        this.particle_number = particle_number;
        this.fps = fps;
        this.max_transition_speed = max_transition_speed,
        this.min_transition_speed = min_transition_speed,
        this.particle_maxwidth = particle_maxwidth;
        this.particle_minwidth = particle_minwidth;
        this.particle_radius = particle_radius;
        this.particle_colision_change = particle_colision_change;
        this.particle_background = particle_background;
        this.particle_image = particle_image; 
        this.responsive = responsive;
        this.particle_opacity = particle_opacity;
        this.refresh_onfocus = refresh_onfocus;

        // Global Variables
        var randomID = Math.floor(Math.random() * (9999 - 0 + 1)) + 0;
        var selector = this.selector;
        var fps = this.fps;
        var isPlaying = true;
        var particle_maxwidth = this.particle_maxwidth;
        var particle_minwidth = this.particle_minwidth;
        var particle_radius = this.particle_radius;
        var particle_colision_change = this.particle_colision_change;
        var particle_background = this.particle_background;
        var particle_image = this.particle_image;
        var responsive = this.responsive;
        var particle_opacity = this.particle_opacity;
        var trail_count = 0;
        var max_transition_speed = this.max_transition_speed;
        var min_transition_speed = this.min_transition_speed;
        var refresh_onfocus = this.refresh_onfocus;

        var particle_x_ray = [];

        // Add movement to particle
        this.MoveParticle = function(element) {

                var isresting = 1;

                // Moving Directions
                var top_down = ['top', "down"];
                var left_right = ["left", "right"];

                // Random value to decide wich direction follow
                var direction_h = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
                var direction_v = Math.floor(Math.random() * (1 - 0 + 1)) + 0;

                // Direction
                var d_h = left_right[direction_h];
                var d_v = top_down[direction_v];

                var pos = 0, ver = 0, element_width = element.offsetWidth; 
                var rect_main = document.getElementById(selector);

                // Change particle size
                function ChangeParticle(particle)
                {

                    // Check if random color is enabled, change particle color when colides
                    if(particle_background == "random") { particle.style.backgroundColor = getRandomColor(); }

                    // Get random number based on the width and height of main div
                    var RandomWidth = Math.random() * (particle_maxwidth - particle_minwidth) + particle_minwidth;
                    particle.style.width = RandomWidth+"px";
                    particle.style.height = RandomWidth+"px";

                }

                // Set frame to move particle
                function SetFrame() {

                    if (isPlaying) setTimeout(SetFrame, 1000 / fps);

                            // Element offset positioning
                            pos = element.offsetTop; 
                            ver = element.offsetLeft; 

                                // Check colision bounds
                                if(pos >= rect_main.offsetHeight-element_width) {
                                    d_v = "top";
                                    pos = rect_main.offsetHeight-element_width;
                                    isresting = 1;
                                    if(particle_colision_change == true) { ChangeParticle(element); } // Change Particle Size on colision
                                } 
                                if(pos <= 0){
                                    d_v = "down"; 
                                    pos = 0; 
                                   isresting = 1;
                                    if(particle_colision_change == true) { ChangeParticle(element); } // Change Particle Size on colision
                                }
                                if(ver >= rect_main.offsetWidth-element_width){ 
                                    d_h = "left";
                                    ver = rect_main.offsetWidth-element_width;
                                    isresting = 1;
                                     if(particle_colision_change == true) { ChangeParticle(element); } // Change Particle Size on colision
                                 } 
                                if(ver <= 0){ 
                                    d_h = "right";
                                    ver = 0;
                                    isresting = 1;
                                    if(particle_colision_change == true) { ChangeParticle(element); } // Change Particle Size on colision
                                }
                       
                                // It won add another position until the end of transition
                                if(isresting == 1)
                                {

                                    var RandomTransitionTime = Math.floor(Math.random() * (max_transition_speed - min_transition_speed + 1)) + min_transition_speed;
                                    element.style.transitionDuration = RandomTransitionTime+"ms";

                                    // Check Position
                                    if(d_v == "down" && d_h == 'left')
                                    {
                                        element.style.left = Number(element.offsetLeft) - Number(300) + "px"; 
                                        element.style.top = rect_main.offsetHeight-Number(element_width) + "px"; 
                                        isresting = 0;
                                    }
                                    if(d_v == "down" && d_h == 'right')
                                    {
                                        element.style.left = Number(element.offsetLeft) + Number(300) + "px"; 
                                        element.style.top = rect_main.offsetHeight-Number(element_width) + "px"; 
                                        isresting = 0;
                                       
                                    }
                                    if(d_v == "top" && d_h == 'left')
                                    {
                                        element.style.left = Number(element.offsetLeft)-Number(element_width) - Number(300) + "px"; 
                                        element.style.top = "0px"; 
                                        isresting = 0;
                                      
                                    }
                                    if(d_v == "top" && d_h == 'right') 
                                    {
                                        element.style.left = Number(element.offsetLeft)-Number(element_width) + Number(300) + "px"; 
                                        element.style.top = "0px"; 
                                        isresting = 0;
                                    }  
                                }
                             
                            // Saves particle position to array
                            if(element.offsetLeft != 0 && element.offsetTop != 0) { particle_x_ray[element.id] = ({'id': element.id, 'x': element.offsetLeft, 'y': element.offsetTop}); }
      
                }

                // Call function for the first time
                SetFrame();
        };

        // Set up particles to selector div
        this.SetupParticles = function(number) {

            var resp_particles;
            particle_x_ray = [];

            // Get window viewport inner width
            var windowViewportWidth = window.innerWidth;

            // If functions brings no number, it follow the default
            if(number == undefined)
            {

                // Loop responsive object to get current viewport
                for (var loop = 0; loop < responsive.length; loop++) {
                    if(responsive[loop].breakpoint >= windowViewportWidth) { resp_particles = responsive[loop]["settings"].particle_number; }
                }

                // If there is no result from above, default particles are applied
                if(resp_particles == undefined) { resp_particles = this.particle_number; }

            } else {
                resp_particles = number;
            }

            // Add number of particles to selector div
            for (var i = 1; i <= resp_particles; i++) {

                // Generate random number to particles
                var random_id_particle = Math.floor(Math.random() * (9999 - 0 + 1)) + 0;

                // Check if image source is empty and append particle to main div
                if(this.particle_image['image'] == false)
                {
                    document.getElementById(this.selector).insertAdjacentHTML('beforeend', "<div id='bvparticle_"+random_id_particle+"' class='bvambient_particle' style='display: block;'></div>");  
                } else {
                    document.getElementById(this.selector).insertAdjacentHTML('beforeend', "<img src='"+this.particle_image['src']+"' id='bvparticle_"+random_id_particle+"' class='bvambient_particle' style='display: block;'>");
                }

                var bvparticle = document.getElementById("bvparticle_"+random_id_particle);

                // Add
                particle_x_ray.push("bvparticle_"+random_id_particle);

                // Get Width and Height of main div
                var widthMainDiv = document.getElementById(selector);

                // Get random number based on the width and height of main div
                var RandomTopPosition = Math.floor(Math.random() * (widthMainDiv.offsetHeight - 40 + 1)) + 0;
                var RandomLeftPosition = Math.floor(Math.random() * (widthMainDiv.offsetWidth - 100 + 1)) + 0;

                // Get random number based on the width and height of main div
                var RandomWidth = Math.random() * (this.particle_maxwidth - this.particle_minwidth) + this.particle_minwidth;

                // Get Random Opacity between 0.2 and 1 if active
                if(particle_opacity == true) { var RandomOpacity = Math.random() * (1 - 0.2) + 0.2; } else { var RandomOpacity = 1; }

                // Add random positioning to particle
                bvparticle.style.top = RandomTopPosition+"px"; 
                bvparticle.style.left = RandomLeftPosition+"px"; 
                bvparticle.style.width = RandomWidth+"px";
                bvparticle.style.height = RandomWidth+"px";
                bvparticle.style.opacity = RandomOpacity;                
                bvparticle.style.borderRadius = particle_radius+"px";

                // Check if it has random color enabled
                if(particle_background == "random") { bvparticle.style.backgroundColor = getRandomColor(); } else { bvparticle.style.backgroundColor = particle_background; }

                // Move particle
                this.MoveParticle(bvparticle);
            }
        }

        // ** SETUP SLIDE **
        this.SetupParticles();

        if(refresh_onfocus == true){
        // When user enters tab again refresh position
        document.addEventListener('focus', (e) => {
            document.getElementById(selector).innerHTML = "";
            this.SetupParticles();
        });}

        // Refresh results
        this.particle_x_ray = particle_x_ray;

        // Generates a random hex color
        function getRandomColor() {
              var letters = '0123456789ABCDEF';
              var color = '#';
              for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
              }
              return color;
        }
    }

    // ** METHODS **
    // REFRESH PARTICLES 
    Refresh() {

        // Remove all particles
        document.getElementById(this.selector).innerHTML = "";
        // Setup new Ambient
        this.SetupParticles();
    }

    // DESTROY
    Destroy() {

        // Remove all particles and unbind all its events
        document.getElementById(this.selector).remove();
    }

    // ADD PARTICLES
    Add(number) {
        if(number != undefined)
        {
            // Add new particles
            this.SetupParticles(number);  
        }
    }

    // PAUSE
    Controls(command)
    {
        // Check what type of command is
        switch(command) {
          case "pause": // Pause Particles moviment
            isPaused = true;
            break;
          case "play": // Resume Particles moviment
            isPaused = false;
            break;
          default:
            console.log("BVAmbient | Command not recognized.");
        } 
    }

    // CHANGE PARTICLES
    Change(properties) {

            // Changes particles according to properties available
            if(properties.type == "particle_background")
            {
                document.querySelectorAll('.bvambient_particle').forEach((item) => {
                    // Change to chosen color
                    item.style.backgroundColor = properties.value;
                });
            } else { console.log("BVAmbient | Propertie not recognized."); }
    }
}