async function reloadMappings() {
  let mappings = await window.UPnPClient.getMappings({
    local: true,
  });

  const mappingContainer = document.querySelector("#upnp-mappings");
  mappingContainer.innerHTML = "";

  // generate table rows for all mappings and insert into the mappingContainer
  mappings.forEach((mapping) => {
    const mappingRow = document.createElement("tr");
    mappingRow.innerHTML = `
			<td>${mapping.public.port}</td>
			<td>${mapping.private.port}</td>
			<td>${mapping.description}</td>
			<td class="text-end"><button class="btn btn-danger float-right" title="Removes the UPnP entry" onclick="unmap(${mapping.public.port})">Remove</button></td>
		`;
    mappingContainer.appendChild(mappingRow);
  });
}

(async function () {
  let upnpStatus = document.querySelector(".upnp-status");

  if (await window.UPnPClient.checkIfUPnPIsAvailable()) {
    upnpStatus.innerText = "Supported";
    upnpStatus.classList.replace("bg-dark", "bg-success");

    await reloadMappings();
  } else {
    upnpStatus.innerText = "Not Supported";
    upnpStatus.classList.replace("bg-dark", "bg-danger");
  }
})();

async function unmap(publicPort) {
  await window.UPnPClient.portUnmapping({
    public: publicPort,
  });
  await reloadMappings();
}

document
  .getElementById("make-it-so")
  .addEventListener("click", async function () {
    let internalPort = document.getElementById("internal-port").value;
    let externalPort = document.getElementById("external-port").value;
    let description = document.getElementById("description").value;

    await window.UPnPClient.portMapping({
      public: externalPort,
      private: internalPort,
      description: description,
    });

    await reloadMappings();

    document.getElementById("internal-port").value = "";
    document.getElementById("external-port").value = "";
    document.getElementById("description").value = "";
  });
