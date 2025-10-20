# Google Apps Script Project

This repository contains a collection of Google Apps Script projects designed to automate various tasks, including file management, data integration, and bot communication. Each project is organized into its own directory and can be used independently or in conjunction with other scripts.

## Modules

### Google-Drive-Files-Transfer

This module provides a set of tools for managing files in Google Drive. It allows you to automate the process of transferring file ownership, moving files to different folders, and backing up important data. The scripts are designed to be run from a Google Sheet, making it easy to track and manage file transfers.

### LucasF

`LucasF` is a library of utility functions that can be used across multiple Google Apps Script projects. It includes helper functions for working with arrays, dates, and strings, as well as integrations with various Google services, such as BigQuery, Sheets, and Mail. Additionally, it provides support for external APIs, including Slack and Telegram, allowing you to build powerful integrations with other platforms.

### Telegram-Bot

This module implements a simple yet powerful Telegram bot that can be used to interact with other Google services. The bot is designed to be extensible, allowing you to add new commands and features as needed. It includes built-in support for pinning and recalling messages, as well as an integration with OpenAI's GPT-3 for natural language processing.

## Features

- **Automated File Management**: Transfer ownership of Google Drive files, move files between folders, and create backups of important data.
- **Data Integration**: Connect with Google BigQuery to run queries and manage datasets, and sync data between Google Sheets and other platforms.
- **Email Automation**: Send emails programmatically and manage your inbox with custom scripts.
- **Bot Communication**: Build custom bots for Slack and Telegram to automate workflows and interact with users.
- **Extensible Library**: `LucasF` provides a collection of utility functions that can be easily extended and adapted to your own projects.
- **Natural Language Processing**: The Telegram bot is integrated with OpenAI's GPT-3, allowing it to understand and respond to natural language commands.

## Setup

To get started with these scripts, you will need to create a new Google Apps Script project and copy the code from this repository into your project. You will also need to enable the necessary APIs and services, such as the Google Drive API and the BigQuery API, depending on which modules you plan to use.

## Usage

Each module is designed to be used independently, so you can pick and choose the scripts that are most relevant to your needs. The `Google-Drive-Files-Transfer` module is designed to be run from a Google Sheet, while the `Telegram-Bot` module can be deployed as a web app. The `LucasF` library can be included in any of your Google Apps Script projects to provide a set of reusable utility functions.
