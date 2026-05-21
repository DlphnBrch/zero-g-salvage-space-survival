import * as THREE from 'three';
import { ITEM_TYPES } from '../utils/constants.js';

function makeStripedBox(width, height, depth, color, stripeColor) {
	const group = new THREE.Group();
	const base = new THREE.Mesh(
		new THREE.BoxGeometry(width, height, depth),
		new THREE.MeshStandardMaterial({ color, roughness: 0.58, metalness: 0.04 })
	);
	group.add(base);
	
	const stripe = new THREE.Mesh(
		new THREE.BoxGeometry(width * 1.04, height * 0.22, depth * 1.04),
		new THREE.MeshStandardMaterial({ color: stripeColor, roughness: 0.48 })
	);
	group.add(stripe);
	return group;
}
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
			mesh = makeStripedBox(0.9 * scale, 0.55 * scale, 0.25 * scale, definition.color, 0xeef3a1);
			break;
		case ITEM_TYPES.WATER:
			mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.22 * scale, 0.22 * scale, 0.95 * scale, 18), material);
			break;
		case ITEM_TYPES.OXYGEN:
			mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.32 * scale, 0.32 * scale, 1.35 * scale, 20), material);
			break;
		case ITEM_TYPES.EXTINGUISHER:
			mesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.28 * scale, 0.75 * scale, 8, 16), material);
			break;
		case ITEM_TYPES.CRATE:
			mesh = makeStripedBox(1.2 * scale, 1.2 * scale, 1.2 * scale, definition.color, 0xf6c66f);
			break;
		default:
			mesh = makeDebris(scale, material);
			break;
	}
	
	mesh.traverse((child) => {
		if (!child.isMesh) return;
		child.castShadow = true;
		child.receiveShadow = true;
		if (child.material?.emissive) {
			child.material.emissive.setHex(definition.emissive);
			child.material.emissiveIntensity = 0.25;
		}
	});
	
	mesh.userData.originalEmissive = definition.emissive;
	mesh.userData.originalEmissiveIntensity = 0.25;
	mesh.userData.definition = definition;
	
	return mesh;
}
