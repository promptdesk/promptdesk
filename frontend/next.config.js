/** @type {import('next').NextConfig} */

var dotenv = require('dotenv')

var NODE_ENV = process.env.NODE_ENV || 'development'

dotenv.config({path:`../.env.${NODE_ENV}.local`})

console.log(process.env.PROMPT_SERVER_URL)

const nextConfig = {
  output: 'export',
  distDir: './dist',
  env: {
    PROMPT_SERVER_URL: process.env.PROMPT_SERVER_URL,
  },
}

module.exports = nextConfig