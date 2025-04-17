# 🎥 Video Wall Controller

A powerful Node.js application to control and display synchronized video content across multiple displays using Raspberry Pi devices.

## 🌟 Features

- 🖥️ Multiple Display Configurations:
  - 1x1 (Single display)
  - 1x2 (Horizontal dual display)
  - 2x1 (Vertical dual display)
  - 2x2 (Four display grid)
- 🎬 Video Streaming Support:
  - Supports MP4 video format
  - Real-time video streaming using UDP multicast
  - Hardware-accelerated playback with omxplayer
- 🎮 Easy Control Interface:
  - Upload videos through web interface
  - Start/Stop streaming controls
  - Dynamic layout configuration
- 🔄 Client-Server Architecture:
  - Server for video management and streaming
  - Client for display control and synchronization

## 🖼️ Display Configurations

### 1x2 Layout (Horizontal)
```
+-------------+-------------+
|             |             |
|  Display 1  |  Display 2  |
|             |             |
+-------------+-------------+
```

### 2x1 Layout (Vertical)
```
+-------------+
|             |
|  Display 1  |
|             |
+-------------+
|             |
|  Display 2  |
|             |
+-------------+
```

### 2x2 Layout (Grid)
```
+-------------+-------------+
|             |             |
|  Display 1  |  Display 2  |
|             |             |
+-------------+-------------+
|             |             |
|  Display 3  |  Display 4  |
|             |             |
+-------------+-------------+
```

## 🛠️ Technology Stack

- **Backend**: Node.js + Express.js
- **Frontend**: EJS templates + Bootstrap
- **Communication**: Socket.IO for real-time updates
- **Video Processing**: 
  - avconv for server-side streaming
  - omxplayer for client-side playback
- **File Management**: Multer for video uploads

## 🚀 Getting Started

### Prerequisites

- Raspberry Pi devices (1 to 4 depending on configuration)
- Node.js installed on all devices
- Network connection between devices
- HDMI displays

### Installation

1. Clone the repository:
\`\`\`bash
git clone [repository-url]
\`\`\`

2. Install dependencies for both server and client:
\`\`\`bash
# Server setup
cd server_code
npm install

# Client setup
cd ../client_code
npm install
\`\`\`

3. Start the server:
\`\`\`bash
cd server_code
node app.js
\`\`\`

4. Start the client on each Raspberry Pi:
\`\`\`bash
cd client_code
node app.js
\`\`\`

## 🎯 Usage

1. Access the server interface through a web browser
2. Upload your video file through the interface
3. Select the desired display configuration (1x1, 1x2, 2x1, or 2x2)
4. Start streaming to begin playback on connected displays

## 🔧 Configuration

### Display Layouts

- **1x1**: Single display mode
- **1x2**: Two displays horizontally aligned
- **2x1**: Two displays vertically aligned
- **2x2**: Four displays in a grid formation

### Network Settings

- Default server port: 8080
- UDP multicast address: 239.1.1.1:1234

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## ⚠️ Requirements

- Node.js >= 10.x
- avconv/ffmpeg for video processing
- omxplayer on Raspberry Pi clients
- Compatible network infrastructure for multicast

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details