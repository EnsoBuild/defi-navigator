import Fuse from 'fuse.js';
import type { Protocol, Project, Network, ProjectData } from '$lib/types';

class SearchService {
  private projectFuse: Fuse<Project> | null = null;
  private protocolFuse: Fuse<Protocol> | null = null;
  private networkFuse: Fuse<Network> | null = null;
  private projectDataFuse: Fuse<ProjectData> | null = null;

  // Initialize Fuse instances with appropriate configurations
  initializeProjectSearch(projects: Project[]) {
    const options = {
      includeScore: true,
      threshold: 0.3,
      keys: ['id', 'name']
    };
    this.projectFuse = new Fuse(projects, options);
  }

  initializeProtocolSearch(protocols: Protocol[]) {
    const options = {
      includeScore: true,
      threshold: 0.3,
      keys: ['name', 'slug', 'description']
    };
    this.protocolFuse = new Fuse(protocols, options);
  }

  initializeNetworkSearch(networks: Network[]) {
    const options = {
      includeScore: true,
      threshold: 0.3,
      keys: ['name', 'id']
    };
    this.networkFuse = new Fuse(networks, options);
  }

  initializeProjectDataSearch(projects: ProjectData[]) {
    const options = {
      includeScore: true,
      threshold: 0.1,
      keys: [
        'name',
        'protocols.name',
        'protocols.slug',
      ]
    };
    this.projectDataFuse = new Fuse(projects, options);
  }

  // Search methods
  searchProjects(query: string) {
    if (!this.projectFuse) return [];
    return this.projectFuse.search(query).map(result => result.item);
  }

  searchProtocols(query: string) {
    if (!this.protocolFuse) return [];
    return this.protocolFuse.search(query).map(result => result.item);
  }

  searchNetworks(query: string) {
    if (!this.networkFuse) return [];
    return this.networkFuse.search(query).map(result => result.item);
  }

  searchProjectData(query: string) {
    if (!this.projectDataFuse) return [];
    return this.projectDataFuse.search(query).map(result => result.item);
  }

  // Combined search for suggestions
  searchAll(query: string) {
    return {
      projects: this.searchProjects(query),
      protocols: this.searchProtocols(query),
      networks: this.searchNetworks(query)
    };
  }
}

export const searchService = new SearchService();

