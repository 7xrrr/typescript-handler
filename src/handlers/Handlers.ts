import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { CustomClient } from '../index.js';
import { PermissionsBitField } from 'discord.js';

export function convertURLs(url) {
    const url_split = url.split("\\");
    const url_join = url_split.join("/");
    const url_final = `file:///${url_join}`;
    return url_final;
}

function urlToPath(url) {
  return fileURLToPath(url);
}

async function loadCommands(client, dir = path.join(dirname(fileURLToPath(import.meta.url)), '../commands')) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.lstatSync(fullPath);

    if (stat.isDirectory()) {
      await loadCommands(client, fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.ts')) {
      let { default: command } = await import(convertURLs(fullPath));

      if (command && command.name && command.run) {
        client.commands.set(command.name.trim().toLowerCase(), {...command,Permissions: new PermissionsBitField(command.Permissions), botPermission: new PermissionsBitField(command.botPermission)});
      } else {
        console.warn(`Command file '${fullPath}' is missing a name or run function.`);
      }
    }
  }
}

async function loadEvents(client, dir = path.join(dirname(fileURLToPath(import.meta.url)), '../events')) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.lstatSync(fullPath);

    if (stat.isDirectory()) {
      await loadEvents(client, fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.ts')) {
      await import(convertURLs(fullPath));
    }
  }
}

async function loadSlashCommand(client:CustomClient, dir = path.join(dirname(fileURLToPath(import.meta.url)), '../slashCommands')) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.lstatSync(fullPath);

    if (stat.isDirectory()) {
      await loadSlashCommand(client, fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.ts')) {
      const { default: command } = await import(convertURLs(fullPath));

      if (command && command.name && command.run && command.description) {
        console.log(command.name.trim());
        client.slashCommands.set(command.name.trim(), {...command,Permissions: new PermissionsBitField(command.Permissions), botPermission: new PermissionsBitField(command.botPermission)});
      } else {
        console.warn(`Command file '${fullPath}' is missing a name, description, or run function.`);
      }
    }
  }
}

async function autoLoad(client, dir = path.join(dirname(fileURLToPath(import.meta.url)), '../handlers/autoLoad/')) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.lstatSync(fullPath);

    if (stat.isDirectory()) {
      await autoLoad(client, fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.ts')) {
      await import(convertURLs(fullPath));
    }
  }
}

function handleLoadError(client, fullPath, error) {
  if (!error.message.includes('Cannot find module')) throw new Error(error);
  const fileContent = fs.readFileSync(fullPath, 'utf-8');
  const specialDependencies = extractDependencies(fileContent);
  if (specialDependencies) {
    specialDependencies.forEach((d) => {
      if (!client.dependencies.includes(d)) client.dependencies.push(d);
    });
  }
  if (!specialDependencies || specialDependencies.length === 0) throw new Error(error);
  console.log(`File '${fullPath}' failed to load. ${error}`);
}

function extractDependencies(moduleCode) {
  const dependenciesRegex = /dependencies\s*:\s*(\[[^\]]*\])/;
  const match = moduleCode.match(dependenciesRegex);

  if (match && match[1]) {
    try {
      return eval(match[1]);
    } catch (error) {
      return null;
    }
  } else {
    return null;
  }
}

export { loadCommands, loadEvents, loadSlashCommand, autoLoad };
