// Created by Paul Montgomery (paulmontgomery.code@gmail.com) 2014/04/23
// Disclaimer: I am learning Javascript and HTML5 so please forgive the
// inelegant code.

// Needs Bootstrap and Create.js:
// <link href="css/bootstrap.min.css" rel="stylesheet">
// <script src="http://code.createjs.com/createjs-2013.12.12.min.js"></script>


// TODO: Replace the CDN link above with a local CreateJS instance

// TODO:
// * bigger icon hitboxes --- just color in white instead of translucent in icons
// * split out file into separate js file
// * delete icon or reset button?
// * visible rejection of connection
// * physics-based motion
//   - don't allow objects to move out of canvas
//   - Fix broken right click to remove connections

        // General global variables
        var canvas, stage, queue, fps, glow_size;
        var glow_start_color, glow_end_color, physics_on, orig_move_obj;
        var mouse_status, last_mouse_obj;

		// ***** Configuration *****
		// Screen positioning and distance configuration
		fps = 30;
		glow_size = 80; // Glow size
		glow_start_color = "#009900"; // dark green (gradient)
		glow_end_color = "#EEFFEE"; // light green (gradient)
		mouse_status = 0; // 0 = none, 1 = mousedown, 2 = mouseup, 3 = pressmove, 4 = right click, 5 = doubleclick
		last_mouse_obj = null;
		physics_on = 0;
		orig_move_obj = null;

		// HTML div id names (like <div id="name">)
		canvas_name = "canvas";

		// Icon scaling/positioning
		line_width = 6;

		// *** Load Balancer ***
		lb_icon = "images/loadbalancer.png";
		lb_name = "lb";
		lb_x_scale = 0.8;
		lb_y_scale = 0.8;
		lb_x = 35;
		lb_y = 300;
		lb_conn_type = 0;

		// *** Language Packs ***
		// Python
		python_icon = "images/python.png";
		python_name = "Python";
		python_x_scale = 0.25;
		python_y_scale = 0.25;
		python_x = 250;
		python_y = 35;
		python_conn_type = 1;
		// Java
		java_icon = "images/java.png";
		java_name = "Java";
		java_x_scale = 0.25;
		java_y_scale = 0.25;
		java_x = 350;
		java_y = 35;
		java_conn_type = 1;
		// Ruby
		ruby_icon = "images/ruby.png";
		ruby_name = "Ruby";
		ruby_x_scale = 0.75;
		ruby_y_scale = 0.75;
		ruby_x = 450;
		ruby_y = 35;
		ruby_conn_type = 1;
		// Node.js
		nodejs_icon = "images/nodejs.png";
		nodejs_name = "Node.js";
		nodejs_x_scale = 0.85;
		nodejs_y_scale = 0.85;
		nodejs_x = 550;
		nodejs_y = 35;
		nodejs_conn_type = 1;

		// *** Services ***
		// Trove
		trove_icon = "images/database.png";
		trove_name = "Trove";
		trove_x_scale = 0.2; // Scale trove icon to this % in the x direction
		trove_y_scale = 0.2; // Scale trove icon to this % in the y direction
		trove_x = 760; // Trove icon x starting location
		trove_y = 300; // Trove icon y starting location
		trove_conn_type = 2;
		// Memcache
		memcache_icon = "images/memcache.png";
		memcache_name = "Memcached";
		memcache_x_scale = 0.75; // Scale trove icon to this % in the x direction
		memcache_y_scale = 0.75; // Scale trove icon to this % in the y direction
		memcache_x = 760; // Trove icon x starting location
		memcache_y = 400; // Trove icon y starting location
		memcache_conn_type = 2;
		// Newrelic
		newrelic_icon = "images/newRelic.png";
		newrelic_name = "NewRelic";
		newrelic_x_scale = 0.12; // Scale trove icon to this % in the x direction
		newrelic_y_scale = 0.12; // Scale trove icon to this % in the y direction
		newrelic_x = 760; // Trove icon x starting location
		newrelic_y = 200; // Trove icon y starting location
		newrelic_conn_type = 2;



		function preinit() {
        	canvas = document.getElementById(canvas_name);
			// Prevent right clicking window from bringing up a browswer menu
        	canvas.oncontextmenu = function(e) {
				e.preventDefault();
        	}
            stage = new createjs.Stage(canvas);
            stage.mouseMoveOutside = true;

			// Load all files and resources
			queue = new createjs.LoadQueue(false);
			queue.addEventListener("complete", init);
			queue.loadManifest([
				{id:python_name, src:python_icon},
				{id:trove_name, src:trove_icon},
				{id:java_name, src:java_icon},
				{id:ruby_name, src:ruby_icon},
				{id:lb_name, src:lb_icon},
				{id:nodejs_name, src:nodejs_icon},
				{id:memcache_name, src:memcache_icon},
				{id:newrelic_name, src:newrelic_icon}
				]);
		}


        function init() {
        	// Create the icon/draggers - Load Balancer first
			create_icon(lb_name, lb_x, lb_y, lb_x_scale, lb_y_scale, lb_conn_type);
			// Language Packs
			create_icon(python_name, python_x, python_y, python_x_scale, python_y_scale, python_conn_type);
			create_icon(java_name, java_x, java_y, java_x_scale, java_y_scale, java_conn_type);
			create_icon(ruby_name, ruby_x, ruby_y, ruby_x_scale, ruby_y_scale, ruby_conn_type);
			create_icon(nodejs_name, nodejs_x, nodejs_y, nodejs_x_scale, nodejs_y_scale, nodejs_conn_type);
			// Services
			create_icon(trove_name, trove_x, trove_y, trove_x_scale, trove_y_scale, trove_conn_type);
			create_icon(memcache_name, memcache_x, memcache_y, memcache_x_scale,
				memcache_y_scale, memcache_conn_type);
			create_icon(newrelic_name, newrelic_x, newrelic_y, newrelic_x_scale,
				newrelic_y_scale, newrelic_conn_type);


			draw_line(0, 0, 800, 0, "black", 3);
			draw_line(0, 0, 0, 800, "black", 3);
			draw_line(0, 600, 800, 600, "black", 3);
			draw_line(800, 0, 800, 600, "black", 3);

			draw_line(0, 80, 800, 80, "green", 1);
			draw_line(70, 0, 70, 600, "green", 1);
			draw_line(720, 0, 720, 600, "green", 1);
			

			var text = new createjs.Text("Python 2.7", "17px Arial");
			text.x = 210;
			text.y = 65;
			stage.addChild(text);

			var text = new createjs.Text("Java 7", "17px Arial");
			text.x = 328;
			text.y = 65;
			stage.addChild(text);

			var text = new createjs.Text("Ruby 2.1.1", "17px Arial");
			text.x = 410;
			text.y = 65;
			stage.addChild(text);

			var text = new createjs.Text("Node.js 0.10.26", "17px Arial");
			text.x = 505;
			text.y = 65;
			stage.addChild(text);

			var text = new createjs.Text("Load\nBalancer", "15px Arial");
			text.x = 10;
			text.y = 330;
			stage.addChild(text);

			var text = new createjs.Text("New\nRelic", "15px Arial");
			text.x = 745;
			text.y = 225;
			stage.addChild(text);

			var text = new createjs.Text("Trove", "15px Arial");
			text.x = 740;
			text.y = 328;
			stage.addChild(text);

			var text = new createjs.Text("Memcached", "13px Arial");
			text.x = 723;
			text.y = 428;
			stage.addChild(text);

			var text = new createjs.Text("Language\nPacks:", "bold 17px Arial");
			text.x = 80;
			text.y = 30;
			stage.addChild(text);

			var text = new createjs.Text("Services:", "bold 17px Arial");
			text.x = 722;
			text.y = 120;
			stage.addChild(text);


			// Create the main stage ticker to keep everything updated
			createjs.Ticker.setFPS(fps);
			createjs.Ticker.addEventListener("tick", tick);
			stage.update();
		}


		function draw_line(start_x, start_y, end_x, end_y, color, stroke) {
			var line = new createjs.Shape();
			line.graphics.setStrokeStyle(stroke);
			line.graphics.beginStroke(color);
			line.graphics.moveTo(start_x, start_y);
			line.graphics.lineTo(end_x, end_y);
			line.graphics.endStroke();
			stage.addChild(line);
		}


		function create_icon(icon_name, x_pos, y_pos, x_scale, y_scale, conn_type) {
			var bmp = new createjs.Bitmap(queue.getResult(icon_name));
			bmp.scaleX = x_scale;
			bmp.scaleY = y_scale;
			bmp.regX = bmp.image.width * 0.5;
			bmp.regY = bmp.image.height * 0.5;

            var dragger = new createjs.Container();
            dragger.x = x_pos;
            dragger.y = y_pos;
			// Metadata
			dragger.icon_name = icon_name;
			dragger.orig_x = x_pos;
			dragger.orig_y = y_pos;
			dragger.x_scale = x_scale;
			dragger.y_scale = y_scale;
			dragger.conn_type = conn_type;
			dragger.has_moved = false;
            dragger.connection_list = new Array();
            dragger.orig_conn_list = new Array();

            dragger.addChild(bmp);
			console.log("New container " + icon_name + "(" + dragger.id + ")");

            dragger.on("pressmove", function(evt) {
				if (evt.nativeEvent.button == 2) { // Disable right click drag/drop
					return;
				}
            	mouse_status = 3; // pressmove
               	evt.currentTarget.x = evt.stageX;
               	evt.currentTarget.y = evt.stageY;
				redraw_all_lines(evt.currentTarget); // causes continuous line updates
               	stage.update();
            });
			dragger.addEventListener("mousedown", function(evnt) {
				if (evnt.nativeEvent.button == 2) { // right mouse button
					if (mouse_status == 4) { // last click
						if (last_mouse_obj == null) {
							mouse_status = 0; // reset status
							return;
						}
						if (last_mouse_obj == evnt.currentTarget) {
							mouse_status = 0; // reset status
							return;
						}

						// Connect or disconnect two objects
						ret_array = objects_are_connected(evnt.currentTarget,
							last_mouse_obj);
						if (ret_array[0] == true) {
							remove_line_between_objects(evnt.currentTarget, last_mouse_obj,
								ret_array[1], ret_array[2]);
						} else {
							create_line(evnt.currentTarget, last_mouse_obj, true);
							evnt.currentTarget.predrag_x = evnt.currentTarget.x;
							evnt.currentTarget.predrag_y = evnt.currentTarget.y;
							console.log("Setting " + evnt.currentTarget.icon_name +
								"(" + evnt.currentTarget.id + ") orig x,y to " +
								evnt.currentTarget.predrag_x + ", " + evnt.currentTarget.predrag_y);
							last_mouse_obj.predrag_x = last_mouse_obj.x;
							last_mouse_obj.predrag_y = last_mouse_obj.x;
							console.log("Setting " + last_mouse_obj.icon_name +
								"(" + last_mouse_obj.id + ") orig x,y to " +
								last_mouse_obj.predrag_x + ", " + last_mouse_obj.predrag_y);
						}
						
						mouse_status = 0; // reset mouse status
						last_mouse_obj = null;
						return;
					} else {
						last_mouse_obj = evnt.currentTarget;
					}
					mouse_status = 4;
					return;
				}

				mouse_status = 1; // mouse down
				evnt.addEventListener("mouseup", function(evt) {
					// Add a new draggable icon to replace the one moved
					if (mouse_status == 3) { // pressmove - this should be the end
						console.log("Moved container " + evnt.currentTarget.icon_name + 
							"(" + evnt.currentTarget.id + ")");

						if (evnt.currentTarget.has_moved == false) {
							// If object has not been moved, it must be an original icon
							// so create a new one this first time only.
							obj = evnt.currentTarget;
							obj.has_moved = true;
							create_icon(obj.icon_name, obj.orig_x, obj.orig_y,
								obj.x_scale, obj.y_scale, obj.conn_type);
						} else {
							if (num_connections(evnt.currentTarget) > 0) {
								orig_move_obj = evnt.currentTarget;
								evnt.currentTarget.speed = 0;
								physics_on = 50;
							}
						}

						// Remove old lines and draw new ones if needed
						redraw_all_lines(evnt.currentTarget);
					}

					mouse_status = 2; // mouse up
				});
			});

			stage.addChild(dragger);
		}


		function myfunc(obj) {
			console.log("End of tween for " + obj.icon_name + "(" + obj.id + ")");
		}


		function create_line(src_obj, dest_obj, validate) {
			var dist = 0;
			if (validate == true) { // Initial creation
				var src_conn_type, dest_conn_type, num_src_conn, num_dest_conn;

				src_conn_type = src_obj.conn_type;
				dest_conn_type = dest_obj.conn_type;

// TODO - add non-alert visible notification that the connection was not allowed
				if (src_conn_type == null || dest_conn_type == null) {
					console.log("These two components may not be directly connected.*");
					return;
				}
				if (Math.abs(src_conn_type - dest_conn_type) != 1) {
					console.log("These two components may not be directly connected.");
					return;
				}

				// Do not allow connections to "fixed" icons
				if (src_obj.has_moved == false || dest_obj.has_moved == false) {
					console.log("Rejected attempt to connect a static icon");
					return;
				}

				dist = calc_distance(src_obj.x, src_obj.y, dest_obj.x, dest_obj.y);
				src_obj.orig_conn_list.push([dest_obj, dist]);
				dest_obj.orig_conn_list.push([src_obj, dist]);
			}

			var line = new createjs.Shape();
			line.graphics.setStrokeStyle(line_width);
			line.graphics.beginLinearGradientStroke(["black", "green"], [0, 1], 0, 0, 0, 500);
			line.graphics.moveTo(src_obj.x, src_obj.y);
			line.graphics.lineTo(dest_obj.x, dest_obj.y);
			line.graphics.endStroke();
			// Metadata
			dist = calc_distance(src_obj.x, src_obj.y, dest_obj.x, dest_obj.y);
			src_obj.connection_list.push([dest_obj, line]);
			dest_obj.connection_list.push([src_obj, line]);

			stage.addChild(line);
			stage.setChildIndex(line, 0);
			add_glow(src_obj);
			add_glow(dest_obj);
		}


		function num_connections(obj) {
			return obj.connection_list.length;
		}


		function objects_are_connected(src_obj, dest_obj) {
			var src_index, dest_index;

			src_index = null;
			dest_index = null;		
			for (var src_index = src_obj.connection_list.length - 1; src_index >= 0; 
				src_index--) {
				if (src_obj.connection_list[src_index][0] == dest_obj)
					break;
			}
			for (var dest_index = dest_obj.connection_list.length - 1; dest_index >= 0; 
				dest_index--) {
				if (dest_obj.connection_list[dest_index][0] == src_obj)
					break;
			}
			
			if (src_index == null || src_index < 0 || dest_index == null || dest_index < 0)
				return [false, null, null];

			return [true, src_index, dest_index];
		}


		function remove_line_between_objects(src_obj, dest_obj, in_src_index, 
			in_dest_index) {
			var src_index, dest_index;

			src_index = in_src_index;
			dest_index = in_dest_index;
			if (src_index == null || dest_index == null) {
				ret_array = objects_are_connected(src_obj, dest_obj);
				if (ret_array[0] != true) {
					console.log("Objects " + src_obj.icon_name + "(" + 
						src_obj.id + ") and " + dest_obj.icon_name + "(" + dest_obj.id +
						") are not connected.");
						return;
				}
				src_index = ret_array[1];
				dest_index = ret_array[2];
			}
			if (src_index == null || src_index < 0 || dest_index == null ||
				dest_index < 0) {
				return;
			}
			line = src_obj.connection_list[src_index][1];

			src_obj.connection_list.splice(src_index, 1);
			dest_obj.connection_list.splice(dest_index, 1);

			stage.removeChild(line);

			// If no connections, remove glow
			if (num_connections(src_obj) <= 0) {
				remove_glow(src_obj);
			}
			if (num_connections(dest_obj) <= 0) {
				remove_glow(dest_obj);							
			}
		}


		function redraw_all_lines(src_obj) {
			var dest_array = new Array();

			for (var src_index = src_obj.connection_list.length - 1; src_index >= 0; 
				src_index--) {
				dest_array.push(src_obj.connection_list[src_index][0]);
				remove_line_between_objects(src_obj, src_obj.connection_list[src_index][0],
					null, null);
			}
			for (var i = 0; i < dest_array.length; i++) {
				create_line(src_obj, dest_array[i], false);
			}
			console.log("Redrawing " + dest_array.length + " all lines to/from " +
				src_obj.icon_name + "(" + src_obj.id + ")");
		}


		function tick() {
			if (physics_on > 0) {
				//physics_on = false;
				physics_on -= 1;
				perform_force_movement(orig_move_obj);
				for (var i = 0; i < num_connections(orig_move_obj); i++) {
					perform_force_movement(orig_move_obj.connection_list[i][0]);
				}
// TODO start here
			}

			stage.update();
		}


		function get_point_by_distance(x1, y1, x2, y2, distance) {
			var x3 = x2 - x1;
			var y3 = y2 - y1;
			d = calc_distance(x1, y1, x2, y2);
			ratio = distance / d;
			x3 *= ratio;
			y3 *= ratio;
			return [x1 + x3, y1 + y3];
		}
		

		function perform_force_movement(obj) {
			// Iterate all connected objects adding up forces
			var x_change = 0;
			var y_change = 0;
			var force_change = 0;
			var force;
			for (var i = 0; i < num_connections(obj); i++) {
				var dest_obj = obj.orig_conn_list[i][0];
				var pref_dist = obj.orig_conn_list[i][1];
				var dist = calc_distance(obj.x, obj.y, dest_obj.x, dest_obj.y);
//console.log("dist = " + dist + ", pref dist = " + pref_dist);


				delta_dist = dist - pref_dist;
				force = delta_dist / 10;
				if (force > 10)
					force = 10;
				if (force <= -10)
					force = -10;
				x_change += dest_obj.x;
				y_change += dest_obj.y;
				force_change += force;
			}
			x_change = x_change / i;
			y_change = y_change / i;
			force_change = force_change / i;
			point_array = get_point_by_distance(obj.x, obj.y, x_change, y_change, force_change);
			obj.x = point_array[0];
			obj.y = point_array[1];
			redraw_all_lines(obj);
		}
		

		function calc_distance(x1, y1, x2, y2) {
			x_delta = Math.pow((x2 - x1), 2);
			y_delta = Math.pow((y2 - y1), 2);
			retval = Math.sqrt((x_delta + y_delta));
			return retval;
		}


		function add_glow(cont) {
			if (cont.getNumChildren() > 1) {
				//console.log("Trying to add more than 2 children to a dragger.");
				return;
			}
			var graphics = new createjs.Graphics();
			graphics.beginRadialGradientFill([glow_start_color, glow_end_color], [0, 1],
				0, 0, glow_size / 8, 0, 0, glow_size / 2);
			graphics.drawCircle(0, 0, glow_size / 2);
			target = new createjs.Shape(graphics);
			cont.addChild(target);
			cont.setChildIndex(target, 0);

			createjs.Tween.get(target, {loop:true})
				.to({alpha:0}, 2000)
				.to({alpha:1}, 2000);
		}


		function remove_glow(cont) {
			if (cont.getNumChildren() < 2) {
				console.log("Attempt to remove a non-existant glow shape.");
				return;
			}
			cont.removeChildAt(0); // glow shape is always 0
		}

