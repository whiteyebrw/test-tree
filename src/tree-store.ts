export interface TreeItem {
	id: string | number;
	parent: string | number;
	type?: unknown;
}

interface TreeNode extends TreeItem {
	children: string[];
}

export class TreeStore {
	private nodes: Record<string, TreeNode>;
	private initialItems: TreeItem[];

	constructor(items: TreeItem[]) {
		this.nodes = {};
		this.initialItems = [...items];
		this.prepareNodes();
	}

	private prepareNodes() {
		this.initialItems.forEach((item) => {
			const id = String(item.id);
			this.nodes[id] = { ...item, children: [] };
		});

		for (let nodeId in this.nodes) {
			const node = this.nodes[nodeId];

			if (node.parent !== "root") {
				this.nodes[node.parent].children.push(nodeId);
			}
		}
	}

	private convertNodeToItem(node: TreeNode): TreeItem {
		const { children, ...item } = node;
		return item;
	}

	getAll(): TreeItem[] {
		return this.initialItems;
	}

	getItem(id: string | number): TreeItem | undefined {
		const nodeId = String(id);
		const node = this.nodes[nodeId];

		if (!node) {
			return;
		}

		return this.convertNodeToItem(node);
	}

	getChildren(id: string | number): TreeItem[] | undefined {
		const nodeId = String(id);
		const node = this.nodes[nodeId];

		if (!node) {
			return;
		}

		return node.children.map(childId => this.convertNodeToItem(this.nodes[childId]));
	}

	getAllChildren(id: string | number) {
		const nodeId = String(id);
		const node = this.nodes[nodeId];

		if (!node) {
			return;
		}

		const children: TreeItem[] = [];

		const findChildren = (parentId: string) => {
			const item = this.nodes[parentId];

			item.children.forEach(childId => {
				const childItem = this.convertNodeToItem(this.nodes[childId]);
				children.push(childItem);
				findChildren(childId);
			});
		};

		findChildren(nodeId);
		return children;
	}

	getAllParents(id: string | number) {
		const nodeId = String(id);
		const node = this.nodes[nodeId];

		if (!node) {
			return;
		}

		const parents: TreeItem[] = [];

		const findParents = (currentId: string) => {
			const node = this.nodes[currentId];
			const parentId = String(node.parent);

			if (parentId !== "root") {
				const parent = this.nodes[parentId];
				parents.push(this.convertNodeToItem(parent));
				findParents(parentId);
			}
		};

		findParents(nodeId);
		return parents;
	}
}