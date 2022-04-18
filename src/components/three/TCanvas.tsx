import React, { FC, Suspense, useEffect } from 'react';
import * as THREE from 'three';
import { Plane, useTexture } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { cnoise21 } from '../../modules/glsl';

export const TCanvas: FC = () => {
	const OrthographicCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10)

	return (
		<Canvas camera={OrthographicCamera} dpr={window.devicePixelRatio}>
			<Suspense fallback={null}>
				<ScreenPlane />
			</Suspense>
		</Canvas>
	)
}

const ScreenPlane: FC = () => {
	const { width, height } = useThree(state => state.viewport)
	const path = (name: string) => `${import.meta.env.BASE_URL}images/${name}.jpg`
	const textures = useTexture([path('wlop1'), path('wlop2')])

	const shader: THREE.Shader = {
		uniforms: {
			u_time: { value: 0 },
			u_texture1: { value: textures[0] },
			u_texture2: { value: textures[1] },
			u_uvScale1: { value: new THREE.Vector2() },
			u_uvScale2: { value: new THREE.Vector2() }
		},
		vertexShader,
		fragmentShader
	}

	useEffect(() => {
		const uvScale = (texture: THREE.Texture) => {
			const textureAspect = texture.image.width / texture.image.height
			const aspect = width / height
			const ratio = aspect / textureAspect
			const [x, y] = aspect < textureAspect ? [ratio, 1] : [1, 1 / ratio]
			return { x, y }
		}

		shader.uniforms.u_uvScale1.value.set(uvScale(textures[0]).x, uvScale(textures[0]).y)
		shader.uniforms.u_uvScale2.value.set(uvScale(textures[1]).x, uvScale(textures[1]).y)
	}, [width, height])

	useFrame(() => {
		shader.uniforms.u_time.value += 0.005
	})

	return (
		<Plane args={[1, 1]} scale={[width, height, 1]}>
			<shaderMaterial args={[shader]} />
		</Plane>
	)
}

const vertexShader = `
varying vec2 v_uv;

void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

const fragmentShader = `
uniform float u_time;
uniform sampler2D u_texture1;
uniform sampler2D u_texture2;
uniform vec2 u_uvScale1;
uniform vec2 u_uvScale2;
varying vec2 v_uv;

${cnoise21}

mat2 rotate2D(float angle) {
  return mat2(
    cos(angle), -sin(angle),
    sin(angle), cos(angle)
  );
}

void main() {	
	float n = cnoise21(v_uv * 2.0 + u_time);
	vec2 uv = rotate2D(n) * v_uv;
	n = abs(0.5 * (sin(uv.x * 20.0) + 0.5 * 2.0));
	n = smoothstep(0.5, 0.6, n);
	
	vec2 uv1 = (v_uv - 0.5) * u_uvScale1 + 0.5;
	vec2 uv2 = (v_uv - 0.5) * u_uvScale2 + 0.5;
	vec4 tex1 = texture2D(u_texture1, uv1);
	vec4 tex2 = texture2D(u_texture2, uv2);
	vec4 tex = mix(tex1, tex2, n);

	gl_FragColor = tex;
	// gl_FragColor = vec4(vec3(n), 1.0);
}
`
