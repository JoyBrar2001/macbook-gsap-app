import { PresentationControls } from "@react-three/drei";
import type { PresentationControlProps } from "@react-three/drei";
import { useRef } from "react";
import { Group, Mesh } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import MacbookModel16 from "../models/Macbook-16";
import MacbookModel14 from "../models/Macbook-14";

const ANIMATION_DURATION = 1;
const OFFSET_DISTANCE = 5;

type GroupRef = Group | null;

const fadeMeshes = (group: GroupRef, opacity: number) => {
  if (!group) return;

  group.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mesh = child as Mesh;

      // Handle single material
      if (!Array.isArray(mesh.material)) {
        mesh.material.transparent = true;
        gsap.to(mesh.material, { opacity, duration: ANIMATION_DURATION });
      } else {
        // Handle multiple materials
        mesh.material.forEach((mat) => {
          mat.transparent = true;
          gsap.to(mat, { opacity, duration: ANIMATION_DURATION });
        });
      }
    }
  });
};

const moveGroup = (group: GroupRef, x: number) => {
  if (!group) return;
  gsap.to(group.position, { x, duration: ANIMATION_DURATION });
};

interface ModelSwitcherProps {
  scale: number;
  isMobile: boolean;
}

const ModelSwitcher: React.FC<ModelSwitcherProps> = ({ scale, isMobile }) => {
  const smallMacbookRef = useRef<Group>(null);
  const largeMacbookRef = useRef<Group>(null);

  const showLargeMacbook = scale === 0.08 || scale === 0.05;

  const controlsConfig: PresentationControlProps & { config: any } = {
    snap: true,
    speed: 1,
    zoom: 1,
    azimuth: [-Infinity, Infinity],
    config: {
      mass: 1,
      tension: 0,
      friction: 26,
    },
  };

  useGSAP(() => {
    if (showLargeMacbook) {
      moveGroup(smallMacbookRef.current, -OFFSET_DISTANCE);
      moveGroup(largeMacbookRef.current, 0);

      fadeMeshes(smallMacbookRef.current, 0);
      fadeMeshes(largeMacbookRef.current, 1);
    } else {
      moveGroup(smallMacbookRef.current, 0);
      moveGroup(largeMacbookRef.current, OFFSET_DISTANCE);

      fadeMeshes(smallMacbookRef.current, 1);
      fadeMeshes(largeMacbookRef.current, 0);
    }
  }, [scale]);

  return (
    <>
      <PresentationControls {...controlsConfig}>
        <group ref={largeMacbookRef}>
          <MacbookModel16 scale={isMobile ? 0.05 : 0.08} />
        </group>
      </PresentationControls>

      <PresentationControls {...controlsConfig}>
        <group ref={smallMacbookRef}>
          <MacbookModel14 scale={isMobile ? 0.03 : 0.06} />
        </group>
      </PresentationControls>
    </>
  );
};

export default ModelSwitcher;
