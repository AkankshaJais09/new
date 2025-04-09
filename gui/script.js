let processes = [];

document.getElementById("processForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const arrival = parseInt(document.getElementById("arrivalTime").value);
  const burst = parseInt(document.getElementById("burstTime").value);
  const priority = parseInt(document.getElementById("priority").value);

  processes.push({ arrival, burst, priority });

  const list = document.getElementById("processList");
  const listItem = document.createElement("li");
  listItem.textContent = `Arrival: ${arrival}, Burst: ${burst}, Priority: ${priority}`;
  list.appendChild(listItem);

  this.reset();
});

document.getElementById("runScheduler").addEventListener("click", () => {

  let output = "<h3>Scheduling Result:</h3><ul>";
  processes.forEach((p, index) => {
    output += `<li>Process ${index + 1} — Arrival: ${p.arrival}, Burst: ${p.burst}, Priority: ${p.priority}</li>`;
  });
  output += "</ul>";
  document.getElementById("output").innerHTML = output;
});
