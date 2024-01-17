export default interface IActiveChecker {
  isActive(name: string): Promise<boolean> | boolean;
}
