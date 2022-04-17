export const onRemoveSmoke = ({
  particles,
}: {
  particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
}) => {
  particles.destroy();
};
