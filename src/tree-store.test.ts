import { describe, it, expect } from 'vitest';
import { TreeStore, TreeItem } from './tree-store';

describe('TreeStore', () => {
	const items: TreeItem[] = [
		{ id: 1, parent: 'root' },
		{ id: 2, parent: 1, type: 'test' },
		{ id: 3, parent: 1, type: 'test' },
		{ id: 4, parent: 2, type: 'test' },
		{ id: 5, parent: 2, type: 'test' },
		{ id: 6, parent: 2, type: 'test' },
		{ id: 7, parent: 4, type: null },
		{ id: 8, parent: 4, type: null }
	];

	const store = new TreeStore(items);

	it('should return all items', () => {
		const result = store.getAll();
		expect(result).toEqual(items);
	});

	describe('getItem', () => {
		it('should return a specific item by id', () => {
			const result = store.getItem(2);
			expect(result).toEqual({ id: 2, parent: 1, type: 'test' });
		});

		it('should return undefined if id is unknown', () => {
			const result = store.getItem(10);
			expect(result).toBeUndefined();
		});
	});

	describe('getChildren', () => {
		it('should return children of a specific node', () => {
			const children = store.getChildren(2);
			expect(children).toEqual([
				{ id: 4, parent: 2, type: 'test' },
				{ id: 5, parent: 2, type: 'test' },
				{ id: 6, parent: 2, type: 'test' },
			]);
		});

		it('should return empty array of a specific node', () => {
			const children = store.getChildren(8);
			expect(children).toEqual([]);
		});

		it('should return undefined of a unknown node', () => {
			const children = store.getChildren(10);
			expect(children).toBeUndefined();
		});
	});

	describe('getAllChildren', () => {
		it('should return all children recursively', () => {
			const allChildren = store.getAllChildren(2);
			expect(allChildren).toEqual([
				{ id: 4, parent: 2, type: 'test' },
				{ id: 7, parent: 4, type: null },
				{ id: 8, parent: 4, type: null },
				{ id: 5, parent: 2, type: 'test' },
				{ id: 6, parent: 2, type: 'test' },
			]);
		});

		it('should return undefined of a unknown node', () => {
			const allChildren = store.getAllChildren(10);
			expect(allChildren).toBeUndefined();
		});

		it('should return empty children', () => {
			const allChildren = store.getAllChildren(8);
			expect(allChildren).toEqual([]);
		});
	});

	describe('getAllParents', () => {
		it('should return all parents up to root', () => {
			const allParents = store.getAllParents(7);
			expect(allParents).toEqual([
				{ id: 4, parent: 2, type: 'test' },
				{ id: 2, parent: 1, type: 'test' },
				{ id: 1, parent: 'root' }
			]);
		});

		it('should return undefined of a unknown node', () => {
			const allParents = store.getAllParents(10);
			expect(allParents).toBeUndefined();
		});

		it('should return empty children', () => {
			const allParents = store.getAllParents(1);
			expect(allParents).toEqual([]);
		});
	});
});
