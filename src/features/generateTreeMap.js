/* eslint-disable max-statements */
const d3 = require("d3");
const jsdom = require("jsdom");

const generateTreeMap = () => {
  const { JSDOM } = jsdom;

  const { document } = new JSDOM("").window;
  global.document = document;

  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const width = 445 - margin.left - margin.right;
  const height = 445 - margin.top - margin.bottom;

  const body = d3.select(document).select("body");

  let svg = body.append("svg").attr("width", width).attr("height", height);

  svg = svg
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const table = [
    { name: "Origin", parent: "", value: "" },
    { name: "grp1", parent: "Origin", value: 12 },
    { name: "grp2", parent: "Origin", value: 23 },
    { name: "grp3", parent: "Origin", value: 11 },
    { name: "grp4", parent: "Origin", value: 40 },
    { name: "grp5", parent: "Origin", value: 30 },
    { name: "grp6", parent: "Origin", value: 25 }
  ];

  const root = d3
    .stratify()
    .id((d) => d.name)
    .parentId((d) => d.parent)(table);

  root.sum((d) => +d.value);

  d3.treemap().size([width, height]).padding(4)(root);

  root.sum((d) => +d.value);

  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .style("stroke", "black")
    .style("fill", "#69b3a2");

  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("x", (d) => d.x0 + 10) // +10 to adjust position (more right)
    .attr("y", (d) => d.y0 + 20) // +20 to adjust position (lower)
    .text((d) => d.data.name)
    .attr("font-size", "15px")
    .attr("fill", "white");

  return body.node().innerHTML;
};

module.exports = generateTreeMap;
