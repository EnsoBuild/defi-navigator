#!/usr/bin/env python3
# simple_file_snapshot.py
# This script uses "### FILE: path/to/file.txt ###" markers to indicate the start of each file in the snapshot
# It respects .gitignore patterns when creating the snapshot

import os
import fnmatch
import argparse
from pathlib import Path
import re


def parse_gitignore(gitignore_path):
    """Parse .gitignore file and return a list of patterns"""
    if not os.path.exists(gitignore_path):
        return []
        
    patterns = []
    with open(gitignore_path, 'r', encoding='utf-8') as f:
        for line in f:
            # Remove comments and whitespace
            line = line.split('#')[0].strip()
            if line:
                patterns.append(line)
    
    return patterns


def should_ignore(file_path, base_path, ignore_patterns):
    """Check if a file should be ignored based on gitignore patterns"""
    if not ignore_patterns:
        return False
        
    # Get the relative path for matching
    rel_path = os.path.relpath(file_path, base_path)
    
    for pattern in ignore_patterns:
        # Handle negation (!)
        if pattern.startswith('!'):
            # If the pattern is negated (explicitly included), skip this pattern
            continue
            
        # Handle directory-specific patterns (ending with /)
        is_dir_pattern = pattern.endswith('/')
        if is_dir_pattern and not os.path.isdir(file_path):
            continue
            
        # Remove trailing / for matching
        if is_dir_pattern:
            pattern = pattern[:-1]
            
        # Convert gitignore pattern to regex
        # Replace ** with a placeholder
        pattern = pattern.replace('**', '__DOUBLE_ASTERISK__')
        
        # Replace * with regex equivalent but not matching /
        pattern = pattern.replace('*', '[^/]*')
        
        # Restore **
        pattern = pattern.replace('__DOUBLE_ASTERISK__', '.*')
        
        # Leading / means match from root
        if pattern.startswith('/'):
            pattern = '^' + pattern[1:]
        else:
            # Match anywhere in path
            pattern = '.*/' + pattern + '|^' + pattern
            
        # Match pattern
        if re.match(pattern, rel_path):
            return True
            
    return False


def create_snapshot(source_path, output_path='./current.snapshot'):
    """Merge all files from source_path into a single snapshot file, respecting .gitignore"""
    
    snapshot = ["# This snapshot contains multiple files. Each file starts with '### FILE: path/to/file ###'"]
    source_path = Path(source_path).resolve()
    
    # Parse .gitignore if it exists
    gitignore_path = source_path / '.gitignore'
    ignore_patterns = parse_gitignore(gitignore_path)
    
    for root, dirs, files in os.walk(source_path):
        # Skip .git directory
        if '.git' in dirs:
            dirs.remove('.git')
        
        for file in files:
            file_path = os.path.join(root, file)
            
            # Skip the output file if it's in the source directory
            if os.path.abspath(file_path) == os.path.abspath(output_path):
                continue
                
            # Skip .gitignore file
            if file == '.gitignore':
                continue
                
            # Check if file should be ignored
            if should_ignore(file_path, source_path, ignore_patterns):
                # print(f"Ignoring file based on .gitignore: {file_path}")
                continue
                
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Get relative path from source directory
                rel_path = os.path.relpath(file_path, source_path)
                
                # Store file with a comment header containing the path
                snapshot.append(f"### FILE: {rel_path} ###\n{content}\n")
            except Exception as e:
                print(f"Skipping binary or unreadable file: {file_path}")
    
    # Write all files to the snapshot
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(snapshot))
    
    print(f"Snapshot created with {len(snapshot)-1} files at {output_path}")


def extract_snapshot(snapshot_path, output_path):
    """Extract files from snapshot back to their original structure"""
    
    with open(snapshot_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split snapshot by file markers
    parts = content.split("### FILE: ")
    
    # Create output directory
    output_dir = Path(output_path)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Skip the first part (empty or contains header explanation)
    file_count = 0
    for part in parts[1:]:
        if not part.strip():
            continue
            
        # Extract filepath and content
        file_path_end = part.find(" ###\n")
        if file_path_end == -1:
            continue
            
        file_path = part[:file_path_end]
        file_content = part[file_path_end + 5:]  # +5 to skip " ###\n"
        
        # Create the file
        full_path = output_dir / file_path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(file_content)
        
        file_count += 1
    
    print(f"Extracted {file_count} files to {output_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Simple file snapshot utility that respects .gitignore")
    subparsers = parser.add_subparsers(dest="command", help="Command to execute")
    
    # Create snapshot command
    create_parser = subparsers.add_parser("create", help="Create a snapshot from a directory")
    create_parser.add_argument("source", help="Source directory to create snapshot from")
    create_parser.add_argument("--output", "-o", default="./current.snapshot", 
                              help="Output snapshot file path (default: ./current.snapshot)")
    
    # Extract snapshot command
    extract_parser = subparsers.add_parser("extract", help="Extract files from a snapshot")
    extract_parser.add_argument("snapshot", help="Snapshot file to extract from")
    extract_parser.add_argument("output", help="Output directory for extracted files")
    
    args = parser.parse_args()
    
    if args.command == "create":
        create_snapshot(args.source, args.output)
    elif args.command == "extract":
        extract_snapshot(args.snapshot, args.output)
    else:
        parser.print_help()