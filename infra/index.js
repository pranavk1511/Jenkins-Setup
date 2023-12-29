const { Config } = require("@pulumi/pulumi");
const gcp = require("@pulumi/gcp");

const config = new Config();
const region = config.get("region") || "us-central1";
const startupScript = `
    #!/bin/bash
    sudo apt-get update
    sudo apt-get install -y openjdk-11-jdk

    # Install Jenkins
    wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
    sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
    sudo apt-get update
    sudo apt-get install -y jenkins

    # Start Jenkins
    sudo systemctl start jenkins
    sudo systemctl enable jenkins
`;
// Create a new GCP Compute Engine instance
/* The code is creating a new Google Cloud Platform (GCP) Compute Engine instance and a firewall rule. */
const vmInstance = new gcp.compute.Instance("my-vm-instance", {
    machineType: "n1-standard-1",
    zone: `${region}-a`,
    bootDisk: {
        initializeParams: {
            image: "debian-cloud/debian-10",
        },
    },
    networkInterfaces: [
        {
            network: "default",
            accessConfigs: [{}],
        },
    ],
    metadataStartupScript: startupScript,
});

const allowAllFirewallRule = new gcp.compute.Firewall("allow-all", {
    network: "default", // Change this if you have a custom network
    allows: [
        {
            protocol: "all", // All protocols
        },
    ],
    sourceRanges: ["0.0.0.0/0"],
});


// Export the IP address of the VM for easy access
exports.instanceIP = vmInstance.networkInterfaces.apply(n => n[0].accessConfigs[0].natIp);

