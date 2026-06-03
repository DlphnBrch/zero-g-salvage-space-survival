import * as THREE from 'three';
import { ITEM_TYPES } from '../utils/constants.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import crateUrl from '../../crate.glb?url';
import extinguisherUrl from '../../sondurucu.glb?url';
import foodUrl from '../../yemek.glb?url';
import oxygenUrl from '../../oxijen.glb?url';
import waterUrl from '../../su.glb?url';

function makeDebris(scale, material) {
	const group = new THREE.Group();
	const core = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55 * scale, 0), material);
	core.scale.set(1.4, 0.8, 0.95);
	group.add(core);

	const shardMaterial = material.clone();
	shardMaterial.color.offsetHSL(0, 0, 0.08);

	for (let i = 0; i < 3; i += 1) {
		const shard = new THREE.Mesh(
			new THREE.TetrahedronGeometry((0.22 + i * 0.05) * scale, 0),
			shardMaterial
		);
		shard.position.set(
			(i - 1) * 0.38 * scale,
			(i % 2 === 0 ? 0.22 : -0.18) * scale,
			(i - 1) * -0.2 * scale
		);
		shard.rotation.set(i * 0.9, i * 0.45, i * 0.7);
		group.add(shard);
	}

	return group;
}

function applyItemMaterialSettings(mesh, definition) {
	mesh.traverse((child) => {
		if (!child.isMesh) return;
		child.castShadow = true;
		child.receiveShadow = false;
		if (child.material?.emissive) {
			child.material.emissive.setHex(definition.emissive);
			child.material.emissiveIntensity = 0.25;
		}
	});
}

function loadMesh(path, definition) {
	const group = new THREE.Group();
	const gltfLoader = new GLTFLoader();
	gltfLoader.load(path, (gltf) => {
		applyItemMaterialSettings(gltf.scene, definition);
		group.add(gltf.scene);
	});
	return group;
}

export function createItemMesh(type, definition) {
	const scale = definition.scale ?? 1;
	const material = new THREE.MeshStandardMaterial({
		color: definition.color,
		emissive: definition.emissive,
		emissiveIntensity: 0.25,
		roughness: 0.55,
		metalness: type === ITEM_TYPES.OXYGEN || type === ITEM_TYPES.EXTINGUISHER ? 0.35 : 0.05
	});
	
	let mesh;
	
	switch (type) {
		case ITEM_TYPES.FOOD:
			mesh = loadMesh(foodUrl, definition);
			break;
		case ITEM_TYPES.WATER:
			mesh = loadMesh(waterUrl, definition);
			break;
		case ITEM_TYPES.OXYGEN:
			mesh = loadMesh(oxygenUrl, definition);
			break;
		case ITEM_TYPES.EXTINGUISHER:
			mesh = loadMesh(extinguisherUrl, definition);
			break;
		case ITEM_TYPES.CRATE:
			mesh = loadMesh(crateUrl, definition);
			break;
		default:
			mesh = makeDebris(scale, material);
			break;
	}
	
	applyItemMaterialSettings(mesh, definition);
	
	mesh.userData.originalEmissive = definition.emissive;
	mesh.userData.originalEmissiveIntensity = 0.25;
	mesh.userData.definition = definition;
	
	return mesh;
}
