
export interface PlatformCapacity {
  name: string;
  maxMembers: number;
  nearCapacityThreshold: number; // Percentage
}

// Define platform capacity limits
export const platformCapacities: Record<string, PlatformCapacity> = {
  whatsapp: {
    name: "WhatsApp",
    maxMembers: 1024,
    nearCapacityThreshold: 93, // Over 93% of capacity is considered "near full"
  },
  telegram: {
    name: "Telegram",
    maxMembers: 200000,
    nearCapacityThreshold: 90,
  },
  slack: {
    name: "Slack",
    maxMembers: 100000,
    nearCapacityThreshold: 90,
  },
  discord: {
    name: "Discord",
    maxMembers: 500000,
    nearCapacityThreshold: 90,
  },
};

// Helper function to get capacity info for a community
export const getCapacityInfo = (platform: string, members: number) => {
  const platformKey = platform.toLowerCase();
  const capacityInfo = platformCapacities[platformKey] || {
    name: platform,
    maxMembers: Infinity,
    nearCapacityThreshold: 90
  };

  const percentFull = (members / capacityInfo.maxMembers) * 100;
  const isNearFull = percentFull >= capacityInfo.nearCapacityThreshold && percentFull < 100;
  const isFull = percentFull >= 100;

  return {
    percentFull: Math.min(percentFull, 100),
    isNearFull,
    isFull,
    maxMembers: capacityInfo.maxMembers,
    remaining: Math.max(capacityInfo.maxMembers - members, 0)
  };
};

// Helper function to format capacity display
export const formatCapacity = (platform: string, members: number) => {
  const platformKey = platform.toLowerCase();
  const capacityInfo = platformCapacities[platformKey];
  
  if (!capacityInfo) {
    return `${members.toLocaleString()} members`;
  }
  
  return `${members.toLocaleString()} / ${capacityInfo.maxMembers.toLocaleString()}`;
};
