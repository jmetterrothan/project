import * as THREE from 'three';

import CommonUtils from '@shared/utils/Common.utils';

import { IConfig } from '@shared/models/graphicsConfig.model';
import { GRAPHICS_QUALITY } from '@shared/enums/graphicsQuality.enum';

const GLOBAL_CONFIG = {
  DEBUG: CommonUtils.isDev(),
};

export const LOW_CONFIG : IConfig = {
  ...GLOBAL_CONFIG,

  MAX_VISIBLE_CHUNKS: 12,
  MAX_RENDERABLE_CHUNKS: 16,

  ENABLE_WATER_EFFECTS: false,
  ENABLE_WEATHER_EFFECTS: false,
  ENABLE_AA: false,
  ENABLE_SHADOWS: false,

  // only used if shadows are enabled
  SHADOW_MAP_SIZE: 1024,
  SHADOW_MAP_TYPE: THREE.BasicShadowMap
};

export const MEDIUM_CONFIG : IConfig = {
  ...GLOBAL_CONFIG,

  MAX_VISIBLE_CHUNKS: 20,
  MAX_RENDERABLE_CHUNKS: 24,

  ENABLE_WATER_EFFECTS: false,
  ENABLE_WEATHER_EFFECTS: false,
  ENABLE_AA: true,
  ENABLE_SHADOWS: true,

  SHADOW_MAP_SIZE: 2048,
  SHADOW_MAP_TYPE: THREE.PCFShadowMap
};

export const HIGH_CONFIG : IConfig = {
  ...GLOBAL_CONFIG,

  MAX_VISIBLE_CHUNKS: 24,
  MAX_RENDERABLE_CHUNKS: 30,

  ENABLE_WATER_EFFECTS: true,
  ENABLE_WEATHER_EFFECTS: true,
  ENABLE_AA: true,
  ENABLE_SHADOWS: true,

  SHADOW_MAP_SIZE: 8192,
  SHADOW_MAP_TYPE: THREE.PCFSoftShadowMap
};

export const CONFIGS = {
  [GRAPHICS_QUALITY.LOW]: LOW_CONFIG,
  [GRAPHICS_QUALITY.MEDIUM]: MEDIUM_CONFIG,
  [GRAPHICS_QUALITY.HIGH]: HIGH_CONFIG,
};