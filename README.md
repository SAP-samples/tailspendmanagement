[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/tailspendmanagement)](https://api.reuse.software/info/github.com/SAP-samples/tailspendmanagement)

# Welcome to TailSpend Management
Welcome to the sample use case of the Tailspend Management application. This open source application developed using the Cloud Application Programming Model (CAP) will help as reference for customers developing applications internally as a possible alternative to current quote automation process using SAP Ariba to manage tailspend. Tail Spend is often overlooked or not managed efficiently, as it tends to be more difficult to control and less visible than core procurement activities. 
Some key aspects provided by Tailspend application to address tail spend are
Preferred Supplier Management
Mapping Regions and Commodity Codes to Supplier
Auto RFP Event Rule Management
SAP ERP Demand


## Requirements
This solution utilizes BTP Services. Below are pre-requisite services for using this application. \
a. PostgreSQL on SAP BTP, hyperscaler \
b. SAP Application Logging Service for SAP BTP \
c. SAP Job Scheduling Service \
d. SAP BTP, Cloud Foundry Runtime

## Description
Ariba Quotation process currently utilizes complex option
Effective tail spend management can lead to better cost savings and other benefits like Risk Reduction, Efficiency by automating and streamlining the process 

Cost Savings: By consolidating suppliers and negotiating better prices companies can realize substantial savings.
Risk Reduction: Lower visibility purchases often carry a higher risk.Effective Tail spend management can help mitigate supplier risk and ensure compliance. 
Efficiency: By Automating and streamlining the tail spend management process, companies can reduce the administrative burden and focus on strategic initiatives. 
Improved data visibility: This can lead to better decision making as companies gain more accurate understanding of the spend.

Sample View of ITK Lite Admin Application

![Reference Image](/tailspend.jpg)

## Database Requirement
Use the main GIT branch if you are using PostgreSQL as your database in BTP. If the database is HANA DB, convert the database HDB and also update MTA.YAML to deploy Multi Target Applications with HANA Database.

## Deploy the Application
Prior to running the package and deploy.

Step1: Go to app directory and run `npm i` command.\
Step2: Run the same command `npm i` under root directory as well.\
Step3: Run the following command to build and deploy the file to the SAP BTP, Cloud Foundry environment.

```
npm run mta:package:deploy
```

## Known Issues
No known Issues

## How to Get Support
[Create an issue](https://github.com/SAP-samples/tailspendmanagement/issues) in this repository if you find a bug or have questions about the content.
 
For additional support, [ask a question in SAP Community](https://answers.sap.com/questions/ask.html).

## Contributing
If you wish to contribute code, or offer fixes and improvements, please send a pull request. Due to legal reasons, contributors will be asked to accept a DCO when they create the first pull request to this project. This happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## License
Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.