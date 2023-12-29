# Step By Step Guide for Hosting this App on Jenkins

## Why Jenkins ? 
- Automation
- Continuous Integration (CI)
- Continuous Delivery (CD)
- Extensibility through Plugins
- Open Source
- Flexibility
- Active Community and Support

## Infra 
Following creates a vm instance on GCP with acess from anywhere 

```javascript


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
```
This is the user script . This installs jenkins . Once you do `pulumi up` , use `ip`:8080 to acess your jenkins server . 
```javascript
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
```
