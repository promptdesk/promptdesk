/** @type {import('next').NextConfig} */

var dotenv = require('dotenv')

var NODE_ENV = process.env.NODE_ENV || 'development'

if (NODE_ENV == 'development') {
  dotenv.config({path:`../.env`})
} else {
  dotenv.config({path:`../.env.${NODE_ENV}.local`})
}

const nextConfig = {
  output: 'export',
  distDir: './dist',
  env: {
    PROMPT_SERVER_URL: process.env.PROMPT_SERVER_URL || "",
    ORGANIZATION_API_KEY: process.env.ORGANIZATION_API_KEY
  },
}

module.exports = nextConfig