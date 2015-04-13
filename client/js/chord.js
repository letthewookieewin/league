/***************************** champion names function *****************************/

function createChord(array, champion_data){

var counter_array = array;

var champion_array = {};

for (var i = 0; i < champion_data.length;i++)
{
  champion_array[champion_data[i]['id']] = {name: champion_data[i]['name']};
}

// champion_array = { '1': { name: 'Annie'},
//   '2': { name: 'Olaf'},
//   '3': { name: 'Galio'},
//   '5': { name: 'Xin Zhao'},
//   '7': { name: 'LeBlanc'},
//   '8': { name: 'Vladimir'},
//   '9': { name: 'Fiddlesticks'},
//   '11': { name: 'Master Yi' },
//   '12': { name: 'Alistar'},
// };

/***************************** Wins data *****************************/
  wins_object = { '1': { name: 'Annie', wins: 10},
  '2': { name: 'Olaf', wins: 10},
  '3': { name: 'Galio', wins: 10},
  '5': { name: 'Xin Zhao', wins: 12},
  '7': { name: 'LeBlanc', wins: 13},
  '8': { name: 'Vladimir', wins: 14},
  '9': { name: 'Fiddlesticks', wins: 15},
  '11': { name: 'Master Yi', wins: 81},
  '12': { name: 'Alistar', wins: 17},
  '15': { name: 'Sivir', wins: 19},
  '17': { name: 'Teemo', wins: 1},
  '20': { name: 'Nunu', wins: 1},
  '22': { name: 'Ashe', wins: 61},
  '25': { name: 'Morgana', wins: 71},
  '26': { name: 'Zilean', wins: 1},
  '30': { name: 'Karthus', wins: 1},
  '31': { name: 'Cho\'Gath', wins: 1},
  '32': { name: 'Amumu', wins: 1},
  '33': { name: 'Rammus', wins: 61},
  '35': { name: 'Shaco', wins: 17},
  '36': { name: 'Dr. Mundo', wins: 51},
  '44': { name: 'Taric', wins: 71},
  '50': { name: 'Swain', wins: 14},
  '53': { name: 'Blitzcrank', wins: 1},
  '54': { name: 'Malphite', wins: 11},
  '57': { name: 'Maokai', wins: 31},
  '59': { name: 'Jarvan IV', wins: 13},
  '62': { name: 'Wukong', wins: 1},
  '63': { name: 'Brand', wins: 41},
  '67': { name: 'Vayne', wins: 11},
  '72': { name: 'Skarner', wins: 411},
  '74': { name: 'Heimerdinger', wins: 41},
  '75': { name: 'Nasus', wins: 11},
  '78': { name: 'Poppy', wins: 25},
  '79': { name: 'Gragas', wins: 1},
  '81': { name: 'Ezreal', wins: 1},
  '84': { name: 'Akali', wins: 17},
  '86': { name: 'Garen', wins: 12},
  '90': { name: 'Malzahar', wins: 14},
  '99': { name: 'Lux', wins: 15},
  '105': { name: 'Fizz', wins: 1},
  '111': { name: 'Nautilus', wins: 1},
  '114': { name: 'Fiora', wins: 1},
  '120': { name: 'Hecarim', wins: 1},
  '121': { name: 'Kha\'Zix', wins: 1},
  '126': { name: 'Jayce', wins: 19},
  '127': { name: 'Lissandra', wins: 19},
  '131': { name: 'Diana', wins: 1},
  '133': { name: 'Quinn', wins: 1},
  '134': { name: 'Syndra', wins: 11},
  '143': { name: 'Zyra', wins: 13},
  '157': { name: 'Yasuo', wins: 13},
  '222': { name: 'Jinx', wins: 11},
  '236': { name: 'Lucian', wins: 17},
  '238': { name: 'Zed', wins: 14},
  '254': { name: 'Vi', wins: 13},
  '432': { name: 'Bard', wins: 15} };

//get champ names from object
function get_champ_names(arr){
  temp = [];
  for (var objectKey in arr){
    temp.push((arr[objectKey].name));
  }
  return temp;
}

//get champ wins from object
function get_champ_wins(arr){
  temp = [];
  for (var objectKey in arr){
    temp.push((arr[objectKey].wins));
  }
  return temp;
}

champion_wins_array = get_champ_wins(wins_object);
champion_names_array = get_champ_names(champion_array);
// console.log(champion_wins_array);
//console.log(champion_names_array);

/***************************** create_matrix function *****************************/

// function create_matrix(orig_string, array){
//     // console.log(array);
//     // console.log(orig_string);
//   var matrix = [];
//   // var inner_array = [];
//   // var check = 0;
//   var whole_string = orig_string.split(/\s+/g);
//   var x = 0;
//   var y = 0;
//     for (i=0;i<array.length;i++) {
//         matrix[i] = new Array();
//         for (j=0;j<array.length;j++) {
//             matrix[i][j]=0;
//         }
//     }
//     // x = array.indexOf(whole_string[whole_string.length-1]);
//     // // console.log("*****", whole_string[whole_string.length-1]);
//     // y = array.indexOf(whole_string[whole_string.length-2]);
//     //  matrix[x][y] = matrix[x][y] + 1;
//     //  matrix[y][x] = matrix[y][x] + 1;
//   for (var i = whole_string.length-2; i >= 0; i--) {
//       x = array.indexOf(whole_string[i]);
//       y = array.indexOf(whole_string[i+1]);
//       matrix[x][y] = matrix[x][y] + 1;
//       matrix[y][x] = matrix[y][x] + 1;
//       // whole_string.pop();
//     }
//     return matrix;
// }

function create_matrix(){

  //create the matrix from the array passed to createChord
  //there is probably bug if not every champion has row data, as the champion array assumes everyone is picked at least once
  var matrix = [];

  for (var i = 0;i<counter_array.length;i++)
  {
    matrix[i] = [];
    var countersToDisplay = 3;
    var winThreshold = 0;
    var topCounters = [];
    for (var j=0;j<counter_array.length;j++)
    {
      if (counter_array[i][j] != null)
      {
        topCounters.push(counter_array[i][j]['wins_against']);
        topCounters.sort(function(a, b){return b-a});
        //check to see if this is one of the top x counters
        if (topCounters.length > countersToDisplay)
        {
          topCounters.pop();
        }
      }
    }
    //console.log(topCounters);
    for (var j=0;j<counter_array.length;j++)
    {
      if (counter_array[i][j] != null && counter_array[i][j]['wins_against'] >= topCounters[2])
      {
          //store wins against this champion
          matrix[i][j] = counter_array[i][j]['wins_against'];
      }else{
          matrix[i][j] = 0;
      }
    }
  }

  console.log(matrix);
  return matrix;
}

//actually creating matrix
var matrix = create_matrix();

//console.log(matrix);

var chord = d3.layout.chord()
    .padding(0)
    .sortSubgroups(d3.descending)
    .matrix(matrix);

var width = 850 * 2,
    height = 550 * 2,
    innerRadius = Math.min(width, height) * .25,
    outerRadius = innerRadius*1.2;

/***************************** random color function *****************************/
function create_range(array){
  var output = [];
  for (var i = 0; i < array.length; i++) {
    output.push('#'+Math.floor(Math.random()*16777215).toString(16));
  }
  return output;
}

//generates random colors for each connection
var range_array = create_range(champion_names_array);

var fill = d3.scale.ordinal()
    .domain(d3.range(champion_names_array.length))
    .range(range_array);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.append("g").selectAll("path")
    .data(chord.groups)
  .enter().append("path")
    .style("fill", function(d) { return fill(d.index); })
    // .style("stroke", function(d) { return fill(d.index); })
    .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
    .on("mouseover", fade(.1))
    .on("mouseout", fade(1));

var ticks = svg.append("g").selectAll("g")
    .data(chord.groups)
  .enter().append("g").selectAll("g")
    .data(groupTicks)
  .enter().append("g")
    .attr("transform", function(d) {
      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
          + "translate(" + outerRadius + ",0)";
    });

//individual ticks color
ticks.append("line")
    .attr("x1", 1)
    .attr("y1", 0)
    .attr("x2", 5)
    .attr("y2", 0)
    .style("stroke", "#FFF");

ticks.append("text")
    .attr("x", 8)
    .attr("dy", ".35em")
    .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
    .style("fill", "#FFF")
    .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
    .text(function(d) { return d.label; });

svg.append("g")
    .attr("class", "chord")
  .selectAll("path")
    .data(chord.chords)
  .enter().append("path")
    .attr("d", d3.svg.chord().radius(innerRadius))
    .style("fill", function(d) { return fill(d.target.index); })
    .style("opacity", 0.9);

var label_array = champion_names_array;

// Returns an array of tick angles and labels, given a group.
function groupTicks(d) {
  var k = (d.endAngle - d.startAngle) / d.value;
  return d3.range(0, d.value, 1000).map(function(v, i) {
    // console.log("v: ", v);
    // console.log("d: ", d);
    // console.log("d.value: ", d.value);
    return {
      angle: v * k + d.startAngle,
      //label: i % 5 ? null : v / 1000 + "k"
      label: champion_names_array[d.index]
    };
  });
}

// console.log(word_array);

// Returns an event handler for fading a given chord group.
function fade(opacity) {
  return function(g, i) {
    svg.selectAll(".chord path")
        .filter(function(d) { return d.source.index != i && d.target.index != i; })
      .transition()
        .style("opacity", opacity);
  };
}
}